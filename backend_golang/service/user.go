package service

import (
	"backend/api"
	"backend/repository"
)

type UserService struct {
	repository *repository.UserRepository
}

func NewUserService(repository *repository.UserRepository) *UserService {
	return &UserService{
		repository: repository,
	}
}

func (service *UserService) GetAllUsers() ([]*api.UserDTO, error) {
	users, err := service.repository.GetAllUsers()
	if err != nil {
		return nil, api.ErrDatabase
	}

	var userDTOs []*api.UserDTO = []*api.UserDTO{}
	for _, user := range users {
		userDTO := &api.UserDTO{
			UserAddress:  user.UserAddress,
			ChargeAddress: user.ChargeAddress,
		}
		userDTOs = append(userDTOs, userDTO)
	}

	return userDTOs, nil
}
