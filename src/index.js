// // Import Bootstrap's JS components
import 'bootstrap'
import $ from 'jquery'
import ApexCharts from 'apexcharts'

// // Optional: Enable all Popovers and Tooltips
import { Tooltip, Popover } from 'bootstrap'

// // Initialize tooltips and popovers
document.addEventListener('DOMContentLoaded', () => {})

$(function () {
  console.log('asdfsdf')

  // const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')]
  // tooltipTriggerList.forEach((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))
  $.each($('[data-bs-toggle="tooltip"]'), function (i, item) {
    new Tooltip(item)
  })
  $.each($('[data-bs-toggle="popover"]'), function (i, item) {
    new Popover(item)
  })
})

export default $
