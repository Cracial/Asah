const Joi = require('joi');
const { fail } = require('./errors');
const id = Joi.string().trim().min(1);
const user = Joi.object({
  name: Joi.string().trim().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin', 'recruiter').default('user'),
});
const login = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
const token = Joi.object({ refreshToken: Joi.string().required() });
const company = Joi.object({
  name: Joi.string().trim().min(1).required(),
  location: Joi.string().trim().min(1).required(),
  description: Joi.string().allow('').optional(),
});
const companyUpdate = Joi.object({
  name: Joi.string().trim().min(1), location: Joi.string().trim().min(1),
  description: Joi.string().allow(''),
}).min(1);
const category = Joi.object({ name: Joi.string().trim().min(1).required() });
const jobFields = {
  company_id: id,
  category_id: id,
  title: Joi.string().trim().min(1),
  description: Joi.string().trim().min(1),
  job_type: Joi.string().trim().min(1),
  experience_level: Joi.string().trim().min(1),
  location_type: Joi.string().trim().min(1),
  location_city: Joi.string().trim().allow(''),
  salary_min: Joi.number().min(0).allow(null),
  salary_max: Joi.number().min(0).allow(null),
  is_salary_visible: Joi.boolean(),
  status: Joi.string().trim().min(1),
};
const job = Joi.object({
  ...jobFields,
  company_id: id.required(), category_id: id.required(), title: jobFields.title.required(),
  description: jobFields.description.required(), job_type: jobFields.job_type.required(),
  experience_level: jobFields.experience_level.required(),
  location_type: jobFields.location_type.required(),
  status: jobFields.status.required(),
});
const jobUpdate = Joi.object(jobFields).min(1);
const application = Joi.object({
  user_id: id.required(), job_id: id.required(),
  status: Joi.string().valid('pending','accepted','rejected','reviewing','interview','hired').default('pending'),
});
const applicationUpdate = Joi.object({ status: Joi.string().trim().min(1).required() });
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: false });
    if (error) return next(failWith(error));
    req.body = value;
    next();
  };
}
function failWith(error) { const e = new Error(error.details.map((d) => d.message).join('; ')); e.statusCode = 400; return e; }
module.exports = { validate, user, login, token, company, companyUpdate, category, job, jobUpdate, application, applicationUpdate };
