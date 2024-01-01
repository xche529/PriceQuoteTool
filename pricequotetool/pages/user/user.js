// pages/user.js
Page({

    data: {
        isAdmin: false,
        isEdit: false,
        isCompany: false,
        isInvite: false,
        showCompanyInfo: false,
        company: null,
        inviteCode: '',
        tempAvatar: '',
        tempNickName: '',
        tempCompanyName: '',
        companyName: '加载中',
        members: [],
        waitList: [],
        blackList: [],
    },

    onLoad() {
        const company = wx.getStorageSync('company');
        const userAvatar = wx.getStorageSync('userAvatar');
        const userName = wx.getStorageSync('userName');
        this.setData({
            tempAvatar: userAvatar,
            tempNickName: userName,
            company: company
        })
        if (company != null) {
            this.setData({
                showCompanyInfo: true,
            })
            console.log('company:', company)
            let compName = ''
            try {
                wx.cloud.callFunction({
                    name: 'getCompanyName',
                    data: {
                        company
                    },
                    success: res => {
                        compName = res.result.companyName
                        this.setData({
                            companyName: compName
                        })
                    },
                    fail: res => {
                        this.setData({
                            companyName: '加载失败'
                        })
                    }
                })
            } catch {
                this.setData({
                    companyName: '加载失败'
                })
            }
        }
        wx.hideLoading()
    },

    onShowEdit() {
        this.setData({
            isEdit: !this.data.isEdit
        })
    },

    onShowCompany() {
        this.setData({
            isCompany: !this.data.isCompany
        })
    },

    onShowInvite() {
        this.setData({
            isInvite: !this.data.isInvite
        })
    },

    // 存储用户昵称
    onInputNickName(event) {
        let value = event.detail.value;
        this.setData({
            tempNickName: value
        })
    },

    // 存储用户选择头像
    onLoadAvatar(event) {
        const avatar = event.detail.avatarUrl
        console.log(avatar)
        this.setData({
            tempAvatar: avatar
        })
    },

    onInputCompanyName(event) {
        let value = event.detail.value;
        this.setData({
            tempCompanyName: value
        })
    },

    onInputInviteCode(event) {
        let value = event.detail.value;
        this.setData({
            inviteCode: value
        })
    },


    onChangeUserInfo() {
        wx.showLoading({
            title: '上传中',
            mask: true
        })
        const cloudPath = 'avatars/' + Math.random().toString(36).substr(2, 15); + '.jpg';
        wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: this.data.tempAvatar,
            success: res => {
                wx.hideLoading()
                wx.showLoading({
                    title: '修改中',
                    mask: true
                })
                wx.cloud.callFunction({
                    name: 'changeUserInfo',
                    data: {
                        name: this.data.tempNickName,
                        avatar: res.fileID,
                    },
                    success: res => {
                        wx.hideLoading()
                        if (res.result.success) {
                            wx.showToast({
                                icon: 'success',
                                title: '修改成功！',
                            })
                            wx.clearStorageSync();
                            wx.setStorageSync('isLoggedIn', true);
                            wx.setStorageSync('userName', this.data.tempNickName);
                            wx.setStorageSync('userAvatar', this.data.tempAvatar);
                            setTimeout(function () {
                                wx.reLaunch({
                                    url: '/pages/index/index'
                                });
                            }, 1000);
                        } else {
                            wx.showToast({
                                icon: 'error',
                                title: '修改失败！',
                            })
                        }
                        console.log(res)
                    },
                    fail: res => {
                        wx.hideLoading()
                        wx.showToast({
                            title: '提交失败！',
                            icon: 'error',
                        })
                    }
                })
            },
            fail: res => {
                wx.hideLoading()
                wx.showToast({
                    title: '上传失败！',
                    icon: 'error',
                })
            }
        })
    },

    onJoinCompany() {
        wx.showLoading({
            title: '注册中',
        })

        wx.cloud.callFunction({
            name: 'joinCompany',
            data: {
                inviteCode: this.data.inviteCode
            },
            success: res => {
                if (res.result.isSuccess) {
                    wx.setStorageSync('company', this.data.inviteCode);
                    wx.hideLoading()
                    wx.showToast({
                        title: '申请成功！',
                        icon: 'success'
                    })
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: '申请失败！',
                        icon: 'error'
                    })
                }
            },
            fail: res => {
                wx.hideLoading()
                wx.showToast({
                    title: '申请失败！',
                    icon: 'error'
                })
            }
        })
    },

    onSignupCompany() {
        wx.showLoading({
            title: '注册中',
        })
        wx.cloud.callFunction({
            name: 'signUpCompany',
            data: {
                name: this.data.tempCompanyName,
            },
            success: res => {
                wx.hideLoading()
                if (res.result.signedUp) {
                    wx.showToast({
                        title: '注册成功！',
                    })
                    console.log(res)
                    this.setData({
                        company: res.result.random,
                        showCompanyInfo: true,
                        isCompany: false,
                        companyName: this.data.tempCompanyName
                    })
                    wx.setStorageSync('company', res.result.random);
                } else {
                    wx.showToast({
                        icon: 'error',
                        title: '注册失败！',
                    })
                }
            },
            fail: res => {
                wx.hideLoading()
                wx.showToast({
                    icon: 'error',
                    title: '注册失败！',
                })
            }
        })
    },
    onCopyInvite() {
        wx.setClipboardData({
            data: this.data.company,
        })
    },

    onShowCompanyInfo() {
        this.data.members = []
        wx.showLoading({
            title: '加载中',
        })
        console.log('yes')
        wx.cloud.callFunction({
            name: 'checkAdmin',
            success: res => {
                if (res.result.admin) {
                    console.log('admin: true')
                    this.getMemberInfo()
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: '您没有权限',
                        icon: 'error'
                    })
                }
            },
            fail: res => {
                wx.hideLoading()
                wx.showToast({
                    title: '加载失败',
                    icon: 'error'
                })
            }
        })
    },

    getMemberInfo() {
        const fs = wx.getFileSystemManager()
        wx.cloud.callFunction({
            name: 'getMemberInfo',
            success: res => {
                let memberSize = 0
                let waitSize = 0

                memberSize = res.result.memberSize
                const memberListSize = res.result.memberSize
                waitSize = res.result.waitList
                console.log(res)
                for (let j = 0; j < 2; j++) {
                    console.log(j)
                    let targetArray = this.data.members
                    let searchType = 'member'
                    if (j == 1) {
                        memberSize = waitSize
                        targetArray = this.data.waitList
                        searchType = 'wait'
                    }
                    console.log(memberSize)
                    if (memberSize === 0) {
                        let empty = {
                            name: '无员工',
                            avatar: ''
                        }
                        targetArray.push(empty)
                        this.setData({
                            members: this.data.members,
                            waitList: this.data.waitList,
                            isAdmin: true
                        })
                        wx.hideLoading()
                    } else {
                        for (let i = 0; i < memberSize; i++) {
                            let filePath = wx.env.USER_DATA_PATH + '/avatar' + i + j + '.png'
                            const newMember = {
                                name: '加载失败',
                                avatar: ''
                            }
                            wx.cloud.callFunction({
                                name: 'getCompanyInfo',
                                data: {
                                    type: searchType,
                                    index: i
                                },
                                success: res => {
                                    newMember.name = res.result.name
                                    console.log(i, targetArray, res)
                                    fs.writeFile({
                                        filePath: filePath,
                                        data: res.result.avatar,
                                        encoding: 'base64',
                                        success: res => {
                                            console.log(res)
                                            newMember.avatar = filePath
                                            targetArray.push(newMember)
                                        },
                                        fail: res => {
                                            console.error(res)
                                            targetArray.push(newMember)
                                        },
                                        complete: res => {
                                            if (this.data.members.length === memberListSize && this.data.waitList.length === waitSize) {
                                                this.setData({
                                                    members: this.data.members,
                                                    waitList: this.data.waitList,
                                                    isAdmin: true
                                                })
                                                wx.hideLoading()
                                            }
                                        }
                                    })
                                },
                                fail: res => {
                                    console.log(res)
                                    wx.showToast({
                                        title: '加载失败',
                                        icon: 'error'
                                    })
                                }
                            })
                        }
                    }

                }
            },
            fail: res => {
                console.log(res)
                wx.hideLoading()
                wx.showToast({
                    title: '加载失败',
                    icon: 'error'
                })
            }
        })
    }

})