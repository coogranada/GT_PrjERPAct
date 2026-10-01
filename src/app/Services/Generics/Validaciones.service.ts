export const regExps: { [key: string]: RegExp } = {
	password: /^(((?=.*[a-z])(?=.*[A-Z]))((?=.*[a-z])(?=.*[0-9]))((?=.*[A-Z])(?=.*[0-9])))(?=.{6,20})/,
	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	number: /^[0-9]*$/,
	Telefono: /^[0-9]*$/,
	decimal1: /^[0-9]+(.[0-9]{0,1})?$/,
	decimal2: /^[0-9]+(.[0-9]{0,2})?$/,
	decimal3: /^[0-9]+(.[0-9]{0,3})?$/,
	numberNeg: /^-?[0-9]*$/,
	decimalNeg1: /^-?[0-9]+(.[0-9]{0,1})?$/,
	decimalNeg2: /^-?[0-9]+(.[0-9]{0,2})?$/,
	decimalNeg3: /^-?[0-9]+(.[0-9]{0,3})?$/,
	nit:/(^[0-9]+-{0,1}[0-9]{0,1})/, //123123123-9
	rutaImagen:/^[a-zA-Z0-9.-]+\.(jpg|png)/
	// "^(([a-zA-Z]:)|(\\{2}\w+)\$?)(\\(\w[\w].*))(.jpg|.JPG|.gif|.GIF|.png|.PNG|.jpeg|.JPEG)$"
	// /[^\\s]+(.*?)\\.(jpg|png)/
	// /"([^\\s]+(\\.(?i)(jpg|png|gif|bmp))$)"/
};

export var errorMessages = {

	rutaImagen: [
		{ type: 'required', message: 'La imagen es requerida.' },
		{ type: 'pattern', message: 'La extensión de la imagen debe estar entre "png y jpg". (imagen.jpg).' }
	],
	email: [
		{ type: 'required', message: 'El correo electrónico es requerido.' },
		{ type: 'pattern', message: 'El correo electrónico no es válido (ejemplo: username@domain.com).' }
	],
	emailSeguridad: [
		{ type: 'required', message: 'El correo electrónico es requerido.' },
		{ type: 'minlength', message: 'El correo electrónico debe tener más de 5 caracteres.' },
		{ type: 'maxlength', message: 'El correo electrónico debe tener menos de 100 caracteres.' },
		{ type: 'pattern', message: 'El correo electrónico no es válido (ejemplo: username@domain.com).' }
	],
	confirmEmail: [
		{ type: 'required', message: 'El correo electrónico es requerido.' },
		{ type: 'areEqual', message: 'Las direcciones de correo electrónico deben coincidir.' }
	],
	password: [
		{ type: 'required', message: 'La contraseña es requerida.' },
		{ type: 'pattern', message: 'La contraseña no cumple con los criterios de seguridad.' }
	],
	confirmPassword: [
		{ type: 'required', message: 'La contraseña es requerida.' },
		{ type: 'areEqual', message: 'Las contraseñas no son iguales.' }
	],
	Telefono: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'pattern', message: 'El campo debe ser un número entero.' },
		{ type: 'minlength', message: 'El teléfono debe tener mínimo 10 caracteres caracteres.' },
		{ type: 'maxlength', message: 'El teléfono debe tener máximo 10 caracteres caracteres.' },

	],
	Documento: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'pattern', message: 'Solo debe contener números.' },
		{ type: 'minlength', message: 'El campo debe tener más de 5 caracteres.' },
		{ type: 'maxlength', message: 'El campo debe tener menos de 20 caracteres.' }
	],
	RazonSocial: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'minlength', message: 'El campo debe tener más de 5 caracteres.' },
		{ type: 'maxlength', message: 'El campo debe tener menos de 250 caracteres.' }
	],
	Requerido: [
		{ type: 'required', message: 'Campo requerido.' }
	],
	RequeridoDecimal1: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'pattern', message: 'El campo debe ser un número entero o con un decimal.' }
	],
	RequeridoDecimal2: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'pattern', message: 'El campo debe ser un número entero o con máximo dos decimales.' }
	],
	RequeridoDecimal3: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'pattern', message: 'El campo debe ser un número entero o con máximo tres decimales.' }
	],
	RequeridoNumber: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'pattern', message: 'El campo debe ser un número entero.' }
	],
	Number: [
		{ type: 'pattern', message: 'El campo debe ser un número entero.' }
	],
	RequeridoNumber5_50: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'pattern', message: 'El campo debe ser un número entero.' },
		{ type: 'minlength', message: 'El campo debe tener más de 5 caracteres.' },
		{ type: 'maxlength', message: 'El campo debe tener menos de 50 caracteres.' }
	],
	Requerido5_50: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'minlength', message: 'El campo debe tener más de 2 caracteres.' },
		{ type: 'maxlength', message: 'El campo debe tener menos de 50 caracteres.' }
	],
	Requerido50: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'maxlength', message: 'El campo debe tener menos de 50 caracteres.' }
	],
	Requerido5_250: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'minlength', message: 'El campo debe tener más de 5 caracteres.' },
		{ type: 'maxlength', message: 'El campo debe tener menos de 250 caracteres.' }
	],
	Requerido5_100: [
		{ type: 'required', message: 'Campo requerido.' },
		{ type: 'minlength', message: 'El campo debe tener más de 5 caracteres.' },
		{ type: 'maxlength', message: 'El campo debe tener menos de 100 caracteres.' }
	],
	TextArea500: [
		{ type: 'maxlength', message: 'El campo debe tener menos de 500 caracteres.' },
		{ type: 'required', message: 'Campo requerido.' },
	],
	nit: [
		{ type: 'required', message: 'El NIT es requerido.' },
		{ type: 'pattern', message: 'El NIT no es válido (ejemplo: 123456789 ó 123456789-3)'}
	],
	criticidad: [
		{ type: 'required', message: 'La criticidad es requerida.' },
		{ type: 'min', message: 'la criticidad no es valida, debe ser un numero entero entre (0 y 9).'},
		{ type: 'max', message: 'la criticidad no es valida, debe ser un numero entero entre (0 y 9).'}

	],
	No_requerido50:[
		{ type: 'maxlength', message: 'El campo debe tener menos de 50 caracteres.' }
	],
	No_requerido30:[
		{ type: 'maxlength', message: 'El campo debe tener menos de 30 caracteres.' }

	]
}