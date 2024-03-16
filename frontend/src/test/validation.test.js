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