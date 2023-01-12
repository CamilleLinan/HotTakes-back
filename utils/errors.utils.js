module.exports.signUpErrors = (error) => {
    let errors = { email: '' }

    if (error.message.includes('unique')) {
        errors.email = "Cette adresse e-mail est déjà utilisée";
    }

    return errors
}