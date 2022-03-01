<template>
    <div class="step-bar">
        <ul>
            <li class="item" :class="{'active': current === step}" v-for="step in steps" :key="step"></li>
        </ul>
        <div class="next-class">
            <img width="65" :src="require('../../assets/img/utils/ico-diamond-chest.svg')" alt=""/>
            <span>
                Próxima aula
                <img width="12" :src="require('../../assets/img/utils/ico-arrow-left.svg')" alt=""/>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['steps', 'current'],
}
</script>

<style scoped>
.step-bar {
    width: 100%;
    margin: 0 0 30px 0;
    font-size: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.step-bar ul {
    margin: 0 22px 0 0;
    padding: 0;
}

.item {
    transition: all ease-in-out 0.3s;
    position: relative;
    display: inline-block;
}

.item:before {
    content: '';
    position: absolute;
    bottom: 6px;
    width: 100%;
    height: 4px;
    background: #5DA857;
    z-index: -1;
    pointer-events: none; 
}

.item:after {
    content: '';
    transition: all 0.1s, top 0;
    top: 0;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    border-radius: 50%;
    background: #5DA857;
    margin: 0 100px 0 0;
    display: inline-block;
    color: white;
    position: relative;
}

.item.active {
    top: 4px;
}

.item.active:before {
    top: 10px;
    background: #ccc; 
}

.item.active:after {
    width: 24px;
    height: 24px;
    background: #5DA857; 
}

.item.active ~ .item:before {
    background: #ccc; 
}

 .item.active ~ .item:after {
    border: 2px solid #ccc;
    background: #fff;
 }

.item:last-child:before {
    content: none;
}

.item:last-child:after {
    margin: 0;
}

/* next class */
.next-class {
    display: flex;
    align-items: center;
}

.next-class span {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    margin-left: 25px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.next-class span img {
    transform: rotate(180deg);
    margin-left: 11px;
}
</style>