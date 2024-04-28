class ErrorHelpr {
    constructor(){
        this.errors = [];
    }

    addError = (name, message, element = null) => {
        this.errors.push({
            name: name,
            message: message,
            element: element || name
        })
    }

    hasErrors = () => {
        return this.errors.length > 0
    }

    hasError = (name) => {
        return !!this.errors.find(i => i.name === name)
    }

    getErrors = () => {
        return this.errors
    }

    getError = (name) => {
        return this.errors.find(i => i.name === name)
    }

    getErrorResponse = (res, withBreak=false) => {

        if (withBreak){
            res.status(500)
        }

        return res.json({
            errors: this.errors
        })
    }
}

module.exports = ErrorHelpr