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

// base_exceptionManager sostituito con il Porvider - Context "ExceptionManagerContext"
/*
export function base_exceptionManager(error, setModal) {
    // - error: errore generato da qualche blocco di codice
    const { message } = error
    console.log(message)
    setModal({
        show: true,
        type: "error",
        data: {
            title: "ModalError - " + message,
            desciption: "Lorem Ipsum is simply dummy text of the printing",
            message:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        },
    });
}
*/

export function formValidation(setError, fields) {
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

export async function fetchApi(
    url = "",
    method = "GET",
    requestData = {},
    callBackFn = () => { }
) {
    /*
    - url: url chiamata da effettuare
    - method: tipo di chiamata [GET, POST, DELETE, INSERT]
    - requestData: oggetto contenete i dati da mandare in una chimata POST
    */

    try {
        //chiamata GET
        if (method.toString().trim().toUpperCase() === "GET") {
            const res = await fetch(url);
            callBackFn(res);
        }

        //chiamata POST
        if (method.toString().trim().toUpperCase() === "POST") {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
            callBackFn(res);
        }
    } catch (error) {
        base_exceptionManager(error);
    }
}

//**********************************************************************
//                            CONVERT FUNCTIONS
//**********************************************************************
export function convertDate(dateIsoString, format = "dd/MM/yyyy HH:mm:ss") {
    /*
    - dateIsoString: esempio 2025-08-23T09:17:45.845Z 
    - format: formato della data convertita
    */

    /*
    //example use
    const format = "dd/MM/yyyy HH:mm:ss"; const date = new Date().toISOString()
    console.log(convertDate(date, format)) // 23/08/2025 14:45:07
    */

    const dateObj = new Date(dateIsoString);

    const map = {
        dd: String(dateObj.getDate()).padStart(2, "0"),
        d: dateObj.getDate(),
        MM: String(dateObj.getMonth() + 1).padStart(2, "0"),
        M: dateObj.getMonth() + 1,
        yyyy: dateObj.getFullYear(),
        yy: String(dateObj.getFullYear()).slice(-2),
        HH: String(dateObj.getHours()).padStart(2, "0"),
        H: dateObj.getHours(),
        hh: String(dateObj.getHours() % 12 || 12).padStart(2, "0"),
        h: dateObj.getHours() % 12 || 12,
        mm: String(dateObj.getMinutes()).padStart(2, "0"),
        m: dateObj.getMinutes(),
        ss: String(dateObj.getSeconds()).padStart(2, "0"),
        s: dateObj.getSeconds(),
        SSS: String(dateObj.getMilliseconds()).padStart(3, "0"),
        tt: dateObj.getHours() < 12 ? "AM" : "PM"
    };

    return format.replace(
        /(dd|d|MM|M|yyyy|yy|HH|H|hh|h|mm|m|ss|s|SSS|tt)/g,
        match => map[match]
    );
}


export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
