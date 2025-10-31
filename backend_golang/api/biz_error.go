package api

// BizError 统一业务错误类型
type BizError struct {
	Code    string
	Message string
}

func (e *BizError) Error() string {
	return e.Message
}

func NewBizError(code, msg string) *BizError {
	return &BizError{
		Code:    code,
		Message: msg,
	}
}

// 常用预定义错误
var (
	ErrBadRequest     = NewBizError("HOME400", "invalid request parameters")
	ErrUnauthorized   = NewBizError("AUTH401", "unauthorized")
	ErrForbidden      = NewBizError("AUTH403", "forbidden")
	ErrNotFound       = NewBizError("HOME404", "resource not found")
	ErrAlreadyExists  = NewBizError("HOME409", "resource already exists")
	ErrWrongPassword  = NewBizError("AUTH410", "invalid password")
	ErrInternalServer = NewBizError("SYS500", "internal server error")
	ErrDatabase       = NewBizError("DB501", "database error")
	ErrInsufficient   = NewBizError("COMMON001", "insufficient balance")
)
