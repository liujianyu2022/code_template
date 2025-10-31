// 定义推荐数据的接口
export interface UserInformationType {
    userAddress: string
    level: string;
    inviteCode: string;
    invitedTime: number
    childrenAddress?: string[]
}

