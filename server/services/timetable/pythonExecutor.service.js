// services/timetable/pythonExecutor.service.js
const { spawn } = require('child_process');
const { PythonShell } = require('python-shell');
const path = require('path');
const logger = require('../../utils/logger');
const { ApiError } = require('../../middleware/errorHandler');

const execPythonScript = (scriptPath, inputData) => {
    return new Promise((resolve, reject) => {
        try {
            // Configure Python shell options
            const options = {
                mode: 'json',
                pythonPath: process.env.PYTHON_PATH || 'python3',
                pythonOptions: ['-u'], // unbuffered output
                scriptPath: path.dirname(scriptPath),
                args: [JSON.stringify(inputData)]
            };

            logger.debug(`Executing Python script: ${scriptPath}`);

            const pyshell = new PythonShell(path.basename(scriptPath), options);

            let output = '';
            let errorOutput = '';

            pyshell.on('message', (message) => {
                output += message;
            });

            pyshell.on('stderr', (stderr) => {
                errorOutput += stderr;
            });

            pyshell.end((err) => {
                if (err) {
                    logger.error(`Python execution error: ${err.message}`);
                    return reject(new ApiError(500, `Python script failed: ${err.message}`));
                }

                if (errorOutput) {
                    logger.error(`Python stderr: ${errorOutput}`);
                }

                try {
                    const result = output ? JSON.parse(output) : {};
                    logger.debug('Python script executed successfully');
                    resolve(result);
                } catch (parseError) {
                    logger.error(`Failed to parse Python output: ${parseError.message}`);
                    reject(new ApiError(500, 'Invalid output from Python script'));
                }
            });

        } catch (error) {
            logger.error(`Python execution setup error: ${error.message}`);
            reject(new ApiError(500, 'Failed to execute Python script'));
        }
    });
};

const validatePythonEnvironment = async () => {
    try {
        const result = await execPythonScript(
            path.join(__dirname, '../../python_models/utils/env_checker.py'),
            { check: 'dependencies' }
        );

        if (!result.valid) {
            throw new Error(result.message || 'Python environment validation failed');
        }

        logger.info('Python environment validated successfully');
        return true;

    } catch (error) {
        logger.error(`Python environment validation error: ${error.message}`);
        throw new ApiError(500, 'Python environment not properly configured');
    }
};

module.exports = {
    execPythonScript,
    validatePythonEnvironment
};