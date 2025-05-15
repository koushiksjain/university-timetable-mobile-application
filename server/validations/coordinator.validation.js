const Joi = require('joi');

// Department validation schema
const departmentSchema = Joi.object({
  name: Joi.string().min(3).max(100).required()
    .messages({
      'string.min': 'Department name must be at least 3 characters long',
      'string.max': 'Department name cannot exceed 100 characters',
      'any.required': 'Department name is required'
    }),
  code: Joi.string().pattern(/^[A-Z]{2,10}$/).required()
    .messages({
      'string.pattern.base': 'Department code must be 2-10 uppercase letters',
      'any.required': 'Department code is required'
    }),
  description: Joi.string().max(500)
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    })
});

// Resource validation schema
const resourceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required()
    .messages({
      'string.min': 'Resource name must be at least 3 characters long',
      'string.max': 'Resource name cannot exceed 100 characters',
      'any.required': 'Resource name is required'
    }),
  type: Joi.string().valid('classroom', 'laboratory', 'equipment', 'other').required()
    .messages({
      'any.only': 'Invalid resource type',
      'any.required': 'Resource type is required'
    }),
  capacity: Joi.number().integer().min(1)
    .messages({
      'number.min': 'Capacity must be at least 1',
      'number.integer': 'Capacity must be a whole number'
    }),
  description: Joi.string().max(500)
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    })
});

// Preference validation schema
const preferenceSchema = Joi.object({
  teacherId: Joi.string().required()
    .messages({
      'any.required': 'Teacher ID is required'
    }),
  preferences: Joi.array().items(
    Joi.object({
      day: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').required()
        .messages({
          'any.only': 'Invalid day',
          'any.required': 'Day is required'
        }),
      timeSlot: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
        .messages({
          'string.pattern.base': 'Time slot must be in HH:MM format',
          'any.required': 'Time slot is required'
        }),
      preference: Joi.string().valid('preferred', 'available', 'unavailable').required()
        .messages({
          'any.only': 'Invalid preference value',
          'any.required': 'Preference is required'
        })
    })
  ).min(1).required()
    .messages({
      'array.min': 'At least one preference must be provided',
      'any.required': 'Preferences are required'
    })
});

// Teacher validation schema
const teacherSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string().min(2).max(50).required()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits',
      'any.required': 'Phone number is required'
    }),
  designation: Joi.string().required()
    .messages({
      'any.required': 'Designation is required'
    })
});

// Subject validation schema
const subjectSchema = Joi.object({
  subjects: Joi.array().items(
    Joi.object({
      subjectId: Joi.string().required()
        .messages({
          'any.required': 'Subject ID is required'
        }),
      isPrimary: Joi.boolean().required()
        .messages({
          'any.required': 'Primary status is required'
        })
    })
  ).min(1).required()
    .messages({
      'array.min': 'At least one subject must be provided',
      'any.required': 'Subjects are required'
    })
});

// Timetable validation schema
const timetableSchema = Joi.object({
  semester: Joi.string().required()
    .messages({
      'any.required': 'Semester is required'
    }),
  academicYear: Joi.string().pattern(/^\d{4}-\d{4}$/).required()
    .messages({
      'string.pattern.base': 'Academic year must be in YYYY-YYYY format',
      'any.required': 'Academic year is required'
    }),
  preferences: Joi.boolean().default(true)
    .messages({
      'boolean.base': 'Preferences must be a boolean value'
    })
});

// Conflict resolution schema
const conflictSchema = Joi.object({
  resolution: Joi.string().valid('swap', 'reassign', 'ignore').required()
    .messages({
      'any.only': 'Invalid resolution type',
      'any.required': 'Resolution type is required'
    }),
  details: Joi.object().required()
    .messages({
      'any.required': 'Resolution details are required'
    })
});

module.exports = {
  departmentSchema,
  resourceSchema,
  preferenceSchema,
  teacherSchema,
  subjectSchema,
  timetableSchema,
  conflictSchema
};