
const PasswordType = {
    Normal: 0,
    New: 1,
    Confirm: 2,
} as const;

type PasswordType = typeof PasswordType[keyof typeof PasswordType];

export default PasswordType;