<template>
    <div class="firt_ts">
        <hello-world></hello-world>
        <p>{{num - count}}</p>
        <p>{{`${count} : ${msg}`}}</p>
        <button @click="countMethod('www.baidu.com')">www.baidu.com</button>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    import HelloWorld from '../../components/HelloWorld.vue';
    import { setInterval } from 'timers';

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
        private readonly num: number = 100;
        public count: number = 1;
        private msg: string = 'Welcome to Your Vue.js App';

        private created(): void {
            console.log('ts in created')
        }

        private mounted(): void {
            console.log('ts in mounted')
            setTimeout(_ => { this.count++ }, 5000)
        }
        private countCopyMethod(countMethodNum: number): void {
            console.log('countCopyMethod:', countMethodNum)
        }

        private countMethod(url: string): string {
            console.log('countMethod:', url)
            this.countCopyMethod(Math.random())
            return url
        }
    }
</script>