<template>
    <div>
        <slot></slot>
        <slot name="header"></slot>
        <div>
            <slot name="scope"></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>
