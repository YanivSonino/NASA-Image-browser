let UserData = [];

module.exports = class User{
    constructor(firstName,lastName,Email, Password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.Email = Email;
        this.Password = Password;
    }
    getFirstName(){return this.firstName;}
    getLastName(){return this.lastName;}
    getEmail(){return this.Email;}
    save(){UserData.push(this);}
    static fetchAllUsers(){return UserData;}
}