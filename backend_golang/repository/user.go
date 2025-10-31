package repository

import (
	"backend/model"

	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		DB: db,
	}
}

func (repository *UserRepository) GetAllUsers() ([]*model.User, error) {
	var users []*model.User
	if err := repository.DB.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}