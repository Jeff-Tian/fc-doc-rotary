# fc-doc-rotary

> [doc-rotary](https://github.com/Jeff-Tian/doc-rotary) 的阿里云函数计算版本。

## 参考

- https://yq.aliyun.com/articles/718653?spm=a2c4e.11153940.0.0.2a0f680cKaOHMN

## 准备

- fun
- 主账号的（子账号应该也行，但会涉及到很多权限分配的问题）
  - AccountId
  - AccessKey
  - AccessKeySecret

## 部署

```bash
fun deploy
```

## 调用

从本地命令行调用云端：

```bash
fun invoke word2pdf-nodejs8
fun invoke word2pdf-python3
```

调用本地：

```bash
fun local invoke word2pdf-nodejs8
```