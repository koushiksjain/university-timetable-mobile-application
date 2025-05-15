// controllers/coordinator/python.controller.js
const { execPythonScript } = require('../../services/timetable/pythonExecutor.service');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const path = require('path');

const runTimetableGeneration = async (req, res) => {
    try {
        const { algorithm, constraints, preferences } = req.body;
        const departmentId = req.user.department;

        // Validate input
        if (!algorithm || !constraints || !preferences) {
            throw new ApiError(400, 'Missing required parameters');
        }

        // Prepare input data for Python
        const inputData = {
            department_id: departmentId,
            algorithm,
            constraints,
            preferences,
            config: {
                max_iterations: 1000,
                population_size: 50,
                mutation_rate: 0.1
            }
        };

        // Determine which Python script to run based on algorithm
        let scriptName;
        switch (algorithm) {
            case 'genetic':
                scriptName = 'genetic_algorithm.py';
                break;
            case 'csp':
                scriptName = 'constraint_solver.py';
                break;
            case 'hybrid':
                scriptName = 'hybrid_approach.py';
                break;
            default:
                throw new ApiError(400, 'Invalid algorithm specified');
        }

        const scriptPath = path.join(__dirname, '../../../python_models/models', scriptName);

        // Execute Python script
        const result = await execPythonScript(scriptPath, inputData);

        if (!result || !result.schedule) {
            throw new ApiError(500, 'Timetable generation failed');
        }

        logger.info(`Generated timetable using ${algorithm} algorithm for department ${departmentId}`);

        res.json({
            success: true,
            data: {
                schedule: result.schedule,
                stats: result.stats,
                conflicts: result.conflicts || []
            }
        });

    } catch (error) {
        logger.error(`Python execution error: ${error.message}`);
        throw error;
    }
};

const validateConstraints = async (req, res) => {
    try {
        const { constraints } = req.body;

        const scriptPath = path.join(__dirname, '../../../python_models/models/constraint_validator.py');

        const result = await execPythonScript(scriptPath, { constraints });

        if (!result || result.valid === undefined) {
            throw new ApiError(500, 'Constraint validation failed');
        }

        res.json({
            success: true,
            data: {
                valid: result.valid,
                issues: result.issues || []
            }
        });

    } catch (error) {
        logger.error(`Constraint validation error: ${error.message}`);
        throw error;
    }
};

module.exports = {
    runTimetableGeneration,
    validateConstraints
};