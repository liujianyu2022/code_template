package api

type UserDTO struct {
	UserAddress string `json:"userAddress"`
	ChargeAddress string `json:"chargeAddress"`   // 充值地址 
}
