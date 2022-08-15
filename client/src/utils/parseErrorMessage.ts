const parseErrorMessage = (action: string, error: any): string => {
    return `${action} ERROR: ${error.message}`
}

export default parseErrorMessage