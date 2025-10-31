package model


type User struct {
	BaseModel
	UserAddress string `json:"user_address" gorm:"type:varchar(42)"`
	ChargeAddress string `json:"charge_address" gorm:"type:varchar(42)"`   // 充值地址 
	// ...
}

func (*User) TableName() string {
	return "users"
}
