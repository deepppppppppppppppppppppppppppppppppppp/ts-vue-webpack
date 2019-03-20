<template>
    <div>
        demo
        <demo-slots
            v-for="item in shapes"
            :key="item.id"
            :data='item'
        >
            title
            <div slot="header">slot header</div>
            <!-- 3.0 v-slot -->
            <!-- <div v-slot:header>slot header</div> -->
            <template
                slot='scope'
                v-slot:item="item"
            >
                <div>
                    scopeSlot
                    {{item.name}}
                    {{item.sides}}
                </div>
            </template>
            <div slot="footer">slot footer</div>
        </demo-slots>
    </div>
</template>
<script>
    import demoSlots from '../../components/demoSlots'
    import mixin from '../../libs/mixins.js'
    export default {
        mixins: [mixin],
        data() {
            return {
                shapes: [
                    { name: 'Square', sides: 4 },
                    { name: 'Hexagon', sides: 6 },
                    { name: 'Triangle', sides: 3 }
                ]
            }
        },
        components: {
            demoSlots
        },
        created() {
            this.demoMixin('mixin')
        }
    }
</script>
