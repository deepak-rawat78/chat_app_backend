import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
const complexityOptions = {
	min: 3,
	max: 26,
	lowerCase: 0,
	upperCase: 0,
	numeric: 0,
	symbol: 0,
	requirementCount: 4,
};

export const signUpBodyValidation = (body: any) => {
	const schema = Joi.object({
		name: Joi.string().label("Name"),
		userName: Joi.string().required().label("User Name"),
		email: Joi.string().required().label("Email"),
		password: passwordComplexity(complexityOptions)
			.required()
			.label("Password"),
	});
	return schema.validate(body);
};

export const loginBodyValidation = (body: any) => {
	const schema = Joi.object({
		email: Joi.string().required().label("Email"),
		password: passwordComplexity(complexityOptions)
			.required()
			.label("Password"),
	});
	return schema.validate(body);
};

export const refreshTokenBodyValidation = (body: any) => {
	const schema = Joi.object({
		refreshToken: Joi.string().required().label("Refresh Token"),
	});
	return schema.validate(body);
};
