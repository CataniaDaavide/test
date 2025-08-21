//**********************************************************************
//                             CHECK FUNCTIONS
//**********************************************************************

export function base_checkEmail(email) {
    /*
    - email: stringa da controllare se è un email corretta
    */

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function base_exceptionManager(error) {
    /* 
    - error: errore generato da qualche blocco di codice
    */
}


export function formValidate(setError, fields) {
    /*
    - setError: funzione per settare gli errori che vengono trovati
    - filds: oggetto contenente le validazioni da effettuare su i vari campi
    */

    const newError = {};
    let hasError = false;

    for (const fieldName in fields) {
        const { value, validators } = fields[fieldName];
        newError[fieldName] = "";

        for (const validatorName in validators) {
            const validator = validators[validatorName];

            // NotEmpty
            if (validatorName === "notEmpty") {
                if (!value || value.toString().trim() === "") {
                    newError[fieldName] = validator.message;
                    hasError = true;
                    break;
                }
            }

            // Callback personalizzata
            if (validatorName === "callback" && validator.callback) {
                const result = validator.callback(value);
                if (!result.valid) {
                    newError[fieldName] = result.message || validator.message;
                    hasError = true;
                    break;
                }
            }

            // Email
            if (validatorName === "email") {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !regex.test(value)) {
                    newError[fieldName] = validator.message || "Email non valida";
                    hasError = true;
                    break;
                }
            }

            // MinLength
            if (validatorName === "minLength") {
                if (value && value.length < validator.value) {
                    newError[fieldName] = validator.message || `Minimo ${validator.value} caratteri`;
                    hasError = true;
                    break;
                }
            }

            // MaxLength
            if (validatorName === "maxLength") {
                if (value && value.length > validator.value) {
                    newError[fieldName] = validator.message || `Massimo ${validator.value} caratteri`;
                    hasError = true;
                    break;
                }
            }

            // Pattern / Regex
            if (validatorName === "pattern") {
                if (value && !validator.value.test(value)) {
                    newError[fieldName] = validator.message || "Formato non valido";
                    hasError = true;
                    break;
                }
            }

            // Integer
            if (validatorName === "integer") {
                if (value && !Number.isInteger(Number(value))) {
                    newError[fieldName] = validator.message || "Deve essere un numero intero";
                    hasError = true;
                    break;
                }
            }

            // Numeric
            if (validatorName === "numeric") {
                if (value && isNaN(Number(value))) {
                    newError[fieldName] = validator.message || "Deve essere un numero";
                    hasError = true;
                    break;
                }
            }

            // Match (es. conferma password)
            if (validatorName === "match") {
                if (value !== validator.value) {
                    newError[fieldName] = validator.message || "I campi non coincidono";
                    hasError = true;
                    break;
                }
            }
        }
    }

    setError(newError);
    return hasError;
}
