<template>
  <div class="uk-grid" prop="row">
    <div class="uk-width-1-1"></div>
  </div>
</template>

<properties>
{
  row: {
    width: false,
    minWidth: false,
    maxWidth: false,
    minHeight: '60px'
  }
}
</properties>

<script>
uno.registerComponent('column-1', {
  settings: {
    icon: 'assets/column-1.svg',
    group: 'Component',
    label: 'Column 1'
  },
  data: {},
  events: {
    beforeInit: function () {},
    afterInit: function () {},
    dragStart: function () {},
    dragMove: function (coords) {},
    dragEnd: function () {},
    ready: function () {}
  }
})
</script>
