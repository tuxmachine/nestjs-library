/* eslint-disable */
export default async () => {
    const t = {
        ["./users/user-role"]: await import("./users/user-role"),
        ["./users/user-status"]: await import("./users/user-status"),
        ["./users/user.entity"]: await import("./users/user.entity")
    };
    return { "@nestjs/swagger": { "models": [[import("./users/user.entity"), { "User": { id: { required: true, type: () => Number }, role: { required: true, enum: t["./users/user-role"].UserRole }, externalId: { required: true, type: () => String }, email: { required: true, type: () => String }, credit: { required: true, type: () => Number }, status: { required: true, enum: t["./users/user-status"].UserStatus }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./users/dto/credit-user.dto"), { "CreditUserDto": { id: { required: true, type: () => Number, minimum: 1 }, amount: { required: true, type: () => Number, minimum: 1 } } }], [import("./users/dto/update-user.dto"), { "UpdateUserDto": { id: { required: true, type: () => Number, minimum: 1 }, email: { required: false, type: () => String }, status: { required: false, enum: t["./users/user-status"].UserStatus } } }]], "controllers": [[import("./dev/dev.controller"), { "DevController": { "seed": {} } }], [import("./users/users.controller"), { "UsersController": { "getUsers": { type: [t["./users/user.entity"].User] }, "updateUser": { type: t["./users/user.entity"].User }, "creditUser": {} } }]] } };
};