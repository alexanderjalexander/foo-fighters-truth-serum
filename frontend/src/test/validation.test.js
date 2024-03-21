import * as validation from "../components/validation";

test('checkEmail Valid 1', () => {
    expect(validation.checkEmail('test@gmail.com')).toBe("");
    expect(validation.checkEmail('aj@yahoo.net')).toBe("");
    expect(validation.checkEmail('a@g.co')).toBe("");
});

test('checkEmail Valid 2', () => {
    expect(validation.checkEmail('125125@222.com')).toBe("");
    expect(validation.checkEmail('a@e.co')).toBe("");
});

test('checkEmail Fail 1', () => {
    let string = "Provided email address isn't valid."
    expect(validation.checkEmail(']]]]@^.com')).toBe(string);
    expect(validation.checkEmail('\'\'\'\'\'')).toBe(string);
    expect(validation.checkEmail('\'.\'.\'.\'')).toBe(string);
    expect(validation.checkEmail('\'.\'.com')).toBe(string);
});

test('checkEmail Fail 2', () => {
    let string = "Provided email address isn't valid."
    expect(validation.checkEmail('Granny Smith')).toBe(string);
    expect(validation.checkEmail('Joseph Joestar')).toBe(string);
    expect(validation.checkEmail('Nintendo CEO @ Tony Hawk . com')).toBe(string);
    expect(validation.checkEmail('&&&&&&&&@&&&&&&&&.&&&&&&&&')).toBe(string);
});

test('checkPassword Valid', () => {
    expect(validation.checkPassword('Stevens42!')).toBe("");
    expect(validation.checkPassword('Dingus2592@@@')).toBe("");
    expect(validation.checkPassword('notThePresident125255@*')).toBe("");
});

test('checkPassword Fail', () => {
    expect(validation.checkPassword('a')).toBe('Password must be at least 10 characters long.');
    expect(validation.checkPassword('AAAAAAAAAAAAAAAAAAAA')).toBe("Password must have at least 1 lower case letter.");
    expect(validation.checkPassword('aaaaaaaaaaaaaaaaaaaa')).toBe("Password must have at least 1 upper case letter.");
    expect(validation.checkPassword('AaAaAaAAAAAAAAAAAAAA')).toBe("Password must have at least 1 number.");
    expect(validation.checkPassword('AaAaAaAa231231232333')).toBe("Password must have at least 1 non alphanumeric character.");
});