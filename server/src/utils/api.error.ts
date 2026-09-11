class ApiError extends Error{
    status: number
    constructor(status: number, message: string){
        super(message)
        this.status = status
    }
}

export class NotFoundError extends ApiError{
    constructor(message: string){
        super(404, message)
    }
}

export class BadRequestError extends ApiError{
    constructor(message: string){
        super(400, message)
    }
}

export class UnauthorizedError extends ApiError{
    constructor(message: string){
        super(401, message)
    }
}

export class ForbiddenError extends ApiError{
    constructor(message: string){
        super(403, message)
    }
}

export class ConflictError extends ApiError{
    constructor(message: string){
        super(409, message)
    }
}

export class InternalServerError extends ApiError{
    constructor(message: string){
        super(500, message)
    }
}

export class ValidationError extends ApiError{
    constructor(message: string){
        super(422, message)
    }
}

