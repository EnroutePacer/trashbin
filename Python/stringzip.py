# 处理形如 [2ab[2cd]ef] 的压缩字符

def uncompress(S):
    slen=len(S)
    Ctrl=[0]*slen
    i_c=0
    for i in range(0,slen):
        # 储存 ] 下标
        if S[slen-i-1]==']':
            Ctrl[i_c]=slen-i-1
            i_c+=1
        # 遇到 [ 闭合,处理闭合区字符串
        if S[slen-i-1]=='[':
            k=1
            n_change=1
            i_c-=1
            if '1'<=S[slen-i]<='9':
                if '0'<=S[slen-i+1]<='9':
                    k*=int(S[slen-i])*10+int(S[slen-i+1])
                    n_change=2
                else:
                    k*=int(S[slen-i])
 
            tmp=k*S[slen-i+n_change:Ctrl[i_c]]
            change=(k-1)*len(S[slen-i+n_change:Ctrl[i_c]])-2-n_change

            if slen-i-2>0:
                S=S[:slen-i-1] + tmp + S[Ctrl[i_c]+1:]
            else:
                S=tmp

            # 字符串处理引起 ] 原本下标改变
            Ctrl=[x+change for x in Ctrl]

    return S


com_string=input()
output=uncompress(com_string)
print(output)