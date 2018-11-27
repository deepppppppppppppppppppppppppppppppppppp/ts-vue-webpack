// 让 ts 识别 .vue 文件
// 引入 .vue 文件的时候，需要手动添加 .vue 后缀
declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}