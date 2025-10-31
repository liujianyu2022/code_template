package handler

import (
	"backend/api"
	"backend/service"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{
		service: service,
	}
}

// GetAllUsers
// @Summary 获取所有的用户信息
// @Tags User
// @Produce json
// @Success 200 {object} api.Response{data=[]api.UserDTO}
// @Failure 200 {object} api.Response
// @Router /user/all [get]
func (handler *UserHandler) GetAllUsers(ctx *gin.Context) () {
	result, err := handler.service.GetAllUsers()
	if err != nil {
		api.HandleError(ctx, err)
		return
	}

	api.HandleSuccess(ctx, result)
}