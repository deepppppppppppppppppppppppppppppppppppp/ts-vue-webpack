<template>
    <div class="firt_ts">
        <hello-world></hello-world>
        <p>{{num - count}}</p>
        <p>{{`${count} : ${msg}`}}</p>
        <button @click="countMethod('www.baidu.com')">www.baidu.com</button>
    </div>
</template>
<script lang="ts">
    /**
     * * 注：
     * ! 移除 null和 undefined类型
     * ? 可选参数
     * 默认 public
     * 不能合并
     * 类与类不能合并
     * 接口与类不能合并
     * 变量与类不能合并
     */

    /**
     * @Emit
     * @Inject
     * @Model
     * @Prop
     * @Provide
     * @Watch
     * @Component (from vue-class-component)
     * Mixins (the helper function named mixins defined at vue-class-component)
     */
    import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
    import HelloWorld from "../../components/HelloWorld.vue";
    import { watch } from "fs";
    // 每段注释后是对比写法
    // @Component 修饰符注明了此类为一个 Vue 组件
    @Component({
        components: {
            HelloWorld
        }
    })
    /**
     * Mixin Home
     *
     * @export
     * @class Home
     * @extends {Vue}
     */
    export default class Home extends Vue {

        // props
        @Prop(Number) index!: number; // 对比 index: { type: Number };
        @Prop({ type: String, default: "ts Props" }) pro!: string; // 对比 pro: { type: String, default: "ts Props" }
        @Prop([String, Number]) str ? : string | number; // 对比 str: { type: [String,Number] }

        // data
        private readonly num: number = 100;
        public count: number = 1;
        private msg: string = "Welcome to Your Vue.js App";

        // watch
        @Watch("count", { immediate: true, deep: true })
        onCountChange(newVal: number, oldVal: number) {
            console.log("count_new:", newVal);
            console.log("count_old:", oldVal);
            //   对比
            //   watch:{
            //       count:{
            //           handle:'onCountChange',
            //           immediate:true,
            //           deep:true
            //       }
            //   }
        }

        @Emit('reset')
        resetCount() {
            this.count = 1
            // 对比
            // resetCount() {
            //   this.count = 1
            //   this.$emit('reset')
            // }
        }

        @Emit()
        addToCount(n: number) {
            this.count += n
            // 对比
            // addToCount(n) {
            //     this.count += n
            //     this.$emit('add-to-count', n)
            // }
        }

        // created
        private created(): void {
            console.log("ts in created");
        }

        // mounted
        private mounted(): void {
            console.log("ts in mounted");
            setTimeout(_ => {
                this.count++;
            }, 5000);
        }

        // methods
        private countCopyMethod(countMethodNum: number): void {
            console.log("countCopyMethod:", countMethodNum);
        }

        private countMethod(url: string): string {
            console.log("countMethod:", url);
            this.countCopyMethod(Math.random());
            return url;
        }
    }
</script>