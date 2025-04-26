document.addEventListener("DOMContentLoaded", function() {
  // Initialize DataTable
  const table = $('.transaction-table').DataTable({
    pageLength: 10,
    lengthMenu: [5, 10, 25, 50],
    order: [[0, 'desc']],
    language: {
      search: '',
      searchPlaceholder: 'Search transactions...'
    },
    responsive: true,
    autoWidth: false
  });

  // Initialize date range picker
  $('#daterange').daterangepicker({
    startDate: moment().subtract(29, 'days'),
    endDate: moment(),
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
  });

  // Currency conversion
  const exchangeRates = {
    NGN: 1,
    USD: 0.00083,
    EUR: 0.00077,
    GBP: 0.00066
  };

  $('#currencySymbol').click(function(e) {
    e.stopPropagation();
    $('#currencyDropdown').toggle();
  });

  $('#currencyDropdown a').click(function(e) {
    e.preventDefault();
    const currency = $(this).data('currency');
    const symbol = $(this).data('symbol');
    const originalAmount = parseFloat($('#balanceAmount').text().replace(/[^0-9.-]+/g, ''));
    const convertedAmount = (originalAmount * exchangeRates[currency]).toFixed(2);
    
    $('#currencySymbol').text(symbol);
    $('#balanceAmount').text(
      new Intl.NumberFormat('en-US').format(convertedAmount)
    );
    $('#currencyDropdown').hide();
  });

  // Download transactions
  $('#downloadTransactions').click(function() {
    const dates = $('#daterange').val().split(' - ');
    const startDate = moment(dates[0]);
    const endDate = moment(dates[1]);
    
    // Filter transactions by date range
    const filteredData = table.rows().data().filter(function(value, index) {
      const rowDate = moment(value[0], 'MMM DD YYYY');
      return rowDate.isBetween(startDate, endDate, 'day', '[]');
    });
    
    // Convert to CSV
    const csv = convertToCSV(filteredData);
    downloadCSV(csv, `transactions_${startDate.format('YYYYMMDD')}_${endDate.format('YYYYMMDD')}.csv`);
  });

  // Handle dropdown menus
  $(document).on('click', '.actions-dropdown .material-icons', function(e) {
    e.stopPropagation();
    $('.dropdown-content').not($(this).siblings('.dropdown-content')).hide();
    $(this).siblings('.dropdown-content').toggle();
  });

  // Close dropdowns when clicking outside
  $(document).click(function() {
    $('.dropdown-content').hide();
  });

  // Form validation and modal handling
  var depositForm = document.querySelector("#deposit-form");
  if (depositForm) {
    depositForm.addEventListener("submit", function(e) {
      var isNewAcct = (document.querySelector("#accounts").value == "add");
      document.querySelector("#external_account_num").required = isNewAcct;
      document.querySelector("#external_routing_num").required = isNewAcct;

      if(!depositForm.checkValidity() || document.querySelector("#deposit-amount").value <= 0.00){
        e.preventDefault();
        e.stopPropagation();
      }
      depositForm.classList.add("was-validated");
    });
  }

  var paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", function(e) {
      document.querySelector("#contact_account_num").required = (document.querySelector("#payment-accounts").value == "add");

      if(!paymentForm.checkValidity() || document.querySelector("#payment-amount").value <= 0.00){
        e.preventDefault();
        e.stopPropagation();
      }
      paymentForm.classList.add("was-validated");
    });
  }

  // Modal refresh functions
  function refreshModals() {
    const paymentSelection = document.querySelector("#payment-accounts")?.value;
    if (paymentSelection === "add") {
      document.querySelector("#otherAccountInputs").classList.remove("hidden");
    } else {
      document.querySelector("#otherAccountInputs").classList.add("hidden");
    }

    const depositSelection = document.querySelector("#accounts")?.value;
    if (depositSelection === "add") {
      document.querySelector("#otherDepositInputs").classList.remove("hidden");
    } else {
      document.querySelector("#otherDepositInputs").classList.add("hidden");
    }
  }

  // Helper functions
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function convertToCSV(data) {
    return data.map(row => row.join(',')).join('\n');
  }

  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Global function for receipt download
  window.downloadReceipt = function(transactionId) {
    window.location.href = `/receipt/${transactionId}`;
  };

  // Initial modal setup
  refreshModals();
});

// Responsive layout adjustments
$(window).resize(function() {
  if ($(window).width() < 992) {
    $('.deposit-send-payment-div').addClass('mb-3');
  } else {
    $('.deposit-send-payment-div').removeClass('mb-3');
  }
}).trigger('resize');