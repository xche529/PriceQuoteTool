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
        this.data.waitList = []
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
        const processMembers = async (memberSize, waitSize, targetArray, searchType, searchSize) => {
            console.log(memberSize, waitSize, targetArray, searchType, searchSize)
            if (searchSize === 0) {
                this.setData({
                    members: this.data.members,
                    waitList: this.data.waitList,
                    isAdmin: true
                })
                wx.hideLoading()
            } else {
                try {
                    const tasks = [];
    
                    for (let i = 0; i < searchSize; i++) {
                        let filePath = wx.env.USER_DATA_PATH + '/avatar' + Math.random().toString(36).substr(2, 15) + '.png';
                        const newMember = {
                            name: '加载失败',
                            avatar: '',
                            index:''
                        };
    
                        const task = new Promise((resolve) => {
                            wx.cloud.callFunction({
                                name: 'getCompanyInfo',
                                data: {
                                    type: searchType,
                                    index: i
                                },
                                success: res => {
                                    newMember.name = res.result.name;
                                    console.log(i, targetArray, res);
    
                                    fs.writeFile({
                                        filePath: filePath,
                                        data: res.result.avatar,
                                        encoding: 'base64',
                                        success: () => {
                                            console.log('Write file success:', filePath);
                                            newMember.avatar = filePath;
                                            newMember.index = i;
                                            targetArray.push(newMember);
                                            resolve();
                                        },
                                        fail: res => {
                                            console.error('Write file failed:', res);
                                            targetArray.push(newMember);
                                            resolve();
                                        }
                                    });
                                },
                                fail: res => {
                                    console.log(res);
                                    wx.showToast({
                                        title: '加载失败',
                                        icon: 'error'
                                    });
                                    resolve();
                                }
                            });
                        });
    
                        tasks.push(task);
                    }
    
                    await Promise.all(tasks);
    
                } catch (error) {
                    console.error(error);
                }
                }
        }
        const loadData = async () => {
            try {
                const res = await wx.cloud.callFunction({
                    name: 'getMemberInfo'
                });
                let memberSize = res.result.memberSize
                let waitSize = res.result.waitSize
                console.log(res)
                await processMembers(memberSize, waitSize, this.data.members, 'member', memberSize)
                await processMembers(memberSize, waitSize, this.data.waitList, 'wait', waitSize)
                this.setData({
                    members: this.data.members,
                    waitList: this.data.waitList,
                    isAdmin: true
                });
            } catch (error) {
                console.error(error);
                wx.showToast({
                    title: '加载失败',
                    icon: 'error'
                });
            } finally {
                wx.hideLoading();
            }

        };

        loadData();

    },

    onApproveMember(e){
        wx.showLoading({
            title: '处理中',
        })
        let index = e.currentTarget.dataset.index;
        const target = this.data.waitList[index].index
        wx.cloud.callFunction({
            name: 'approveMember',
            data:{
                index: target
            },
            success: res => {
                wx.hideLoading()
                if(res.result.isSuccess){
                    console.log('处理成功')
                    this.onShowCompanyInfo()
                }else{
                    console.log(res)
                    wx.showToast({
                        title: '通过失败！',
                      })
                }
            },
            fail: res => {
                console.log(res)
                wx.hideLoading()
                wx.showToast({
                  title: '通过失败！',
                })
            }
        })
    },

    onDeleteMember(e){
        wx.showLoading({
            title: '处理中',
        })
        let index = e.currentTarget.dataset.index;
        const target = this.data.members[index].index
        wx.cloud.callFunction({
            name: 'deleteMember',
            data:{
                type: 'member',
                index: target
            },
            success: res => {
                wx.hideLoading()
                if(res.result.isSuccess){
                    console.log('删除成功')
                    this.onShowCompanyInfo()
                }else{
                    console.log(res)
                    wx.showToast({
                        title: '删除失败！',
                      })
                }
            },
            fail: res => {
                console.log(res)
                wx.hideLoading()
                wx.showToast({
                  title: '通过失败！',
                })
            }
        })

    },

    onDeleteWait(e){
        wx.showLoading({
            title: '处理中',
        })
        let index = e.currentTarget.dataset.index;
        const target = this.data.waitList[index].index
        wx.cloud.callFunction({
            name: 'deleteMember',
            data:{
                type: 'wait',
                index: target
            },
            success: res => {
                wx.hideLoading()
                if(res.result.isSuccess){
                    console.log('删除成功')
                    this.onShowCompanyInfo()
                }else{
                    console.log(res)
                    wx.showToast({
                        title: '删除失败！',
                      })
                }
            },
            fail: res => {
                console.log(res)
                wx.hideLoading()
                wx.showToast({
                  title: '通过失败！',
                })
            }
        })

    }
})