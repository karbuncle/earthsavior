jQuery.extend(true, Chart.defaults.global, {
  defaultFontFamily: "'Roboto', sans-serif"
});

jQuery.extend(true, Chart.defaults.global.elements.point, {
  backgroundColor: '#FFF',
  borderColor: '#ad1457'
});

jQuery.extend(true, Chart.defaults.global.title, {
  display: true,
  fontSize: 20
})

jQuery(function($) {
  var toChartOptions = function (stat) {
    switch (stat.type) {
      case 'item_count':
        return {
          type: 'bar',
          data: {
            labels: (function (a,y){for (var m=0;m<=11;m++) a.push(new Date(y, m)); return a; })([], stat.year),
            datasets: [ 
              { 
                label: 'Garbage',
                backgroundColor: '#d81b60',
                data: stat.data.garbage
              }, 
              { 
                label: 'Recyclable',
                backgroundColor: '#64b5f6',
                data: stat.data.recycle
              } 
            ]
          },
          options: {
            title: { text: stat.title },
            scales: {
              xAxes: [{
                type: 'time',
                time: { 
                  unit: 'month',
                  minUnit: 'month',
                  displayFormats: { month: 'MMM' },
                  tooltipFormat: 'MMM YYYY'
                },
              }],
              yAxes: [{
                scaleLabel: {
                  display: true, 
                  labelString: 'Item Count'
                },
              }]
            }
          }
        };
      case 'category_compare':
        return {
          type: 'pie',
          data: {
            labels: ['Approved', 'Disapproved', 'Uncertain'],
            datasets: [{
              data: [stat.data.approved, stat.data.disapproved, stat.data.unknown],
              backgroundColor: ['#9ccc65', '#ef5350', '#eeeeee']
            }]
          },
          options: {
            title: { text: stat.title }
          }
        };
    }
  };

  (function fetch() {
    $.getJSON('/data/stat.json')
      .done(function(stats) {
	  		stats.reduce(function($charts, stat) {
          var $chart = $('<div></div>').addClass('col s12 m6').appendTo($charts);
          new Chart($('<canvas height="300"></canvas>').appendTo($chart), toChartOptions(stat));

          return $charts;
	  		}, $('#charts'));
        $('#spinner').addClass('hide');
      })
      .fail(function() {
        $('#message')
          .openModal({
            dismissible: false,
            complete: fetch
          });
      });
  })();
});
