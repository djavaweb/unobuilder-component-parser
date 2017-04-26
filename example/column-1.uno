<template>
  <div class="uk-grid" prop="row">
    <div class="uk-width-1-1"></div>
  </div>
</template>

<script>
{
  props: {
    row: {
      width: false,
      minWidth: false,
      maxWidth: false,
      minHeight: '60px'
    }
  },
  settings: {
    id: 'column-1',
    icon: 'assets/column-1.svg',
    group: 'Component',
    label: 'Column 1'
  },
  data: {}
}
</script>
