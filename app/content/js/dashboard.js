/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 77.27272727272727, "KoPercent": 22.727272727272727};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5421022727272727, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49333333333333335, 500, 1500, "Fetch Products-1"], "isController": false}, {"data": [0.245, 500, 1500, "Register Account-1"], "isController": false}, {"data": [1.0, 500, 1500, "Fetch Products-0"], "isController": false}, {"data": [1.0, 500, 1500, "Fetch Order By Product ID-0"], "isController": false}, {"data": [0.445, 500, 1500, "Delete Order By ID"], "isController": false}, {"data": [1.0, 500, 1500, "Register Account-0"], "isController": false}, {"data": [0.0, 500, 1500, "Fetch Order By Product ID-1"], "isController": false}, {"data": [0.0, 500, 1500, "Fetch Order By ID-1"], "isController": false}, {"data": [1.0, 500, 1500, "Edit Order By ID-0"], "isController": false}, {"data": [0.855, 500, 1500, "Fetch Product By ID-1"], "isController": false}, {"data": [1.0, 500, 1500, "Fetch Product By ID-0"], "isController": false}, {"data": [0.23125, 500, 1500, "Fetch Order By ID"], "isController": false}, {"data": [1.0, 500, 1500, "Fetch Order By ID-0"], "isController": false}, {"data": [1.0, 500, 1500, "Create Order-0"], "isController": false}, {"data": [0.0, 500, 1500, "Edit Order By ID"], "isController": false}, {"data": [0.4825, 500, 1500, "Edit Order By Id-1"], "isController": false}, {"data": [0.45, 500, 1500, "Create Order-1"], "isController": false}, {"data": [0.455, 500, 1500, "Fetch Orders"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Order By ID-0"], "isController": false}, {"data": [0.5025, 500, 1500, "Get Orders"], "isController": false}, {"data": [0.455, 500, 1500, "Delete Order By ID-1"], "isController": false}, {"data": [0.615, 500, 1500, "Login Account"], "isController": false}, {"data": [0.8175, 500, 1500, "Fetch Product By ID"], "isController": false}, {"data": [1.0, 500, 1500, "Edit Order By Id-0"], "isController": false}, {"data": [0.1225, 500, 1500, "Register Account"], "isController": false}, {"data": [0.4425, 500, 1500, "Create Order"], "isController": false}, {"data": [0.0, 500, 1500, "Fetch Order By Product ID"], "isController": false}, {"data": [0.4575, 500, 1500, "Fetch Orders-1"], "isController": false}, {"data": [0.0, 500, 1500, "Edit Order By ID-1"], "isController": false}, {"data": [1.0, 500, 1500, "Fetch Orders-0"], "isController": false}, {"data": [0.49166666666666664, 500, 1500, "Fetch Products"], "isController": false}, {"data": [0.4775, 500, 1500, "Edit Order By Id"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8800, 2000, 22.727272727272727, 585.4888636363637, 18, 4685, 654.0, 1066.9000000000005, 1246.949999999999, 1860.9899999999998, 58.1675887551475, 53.29274822027008, 24.9809757282516], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Fetch Products-1", 600, 0, 0.0, 943.31, 340, 4476, 902.5, 1208.9, 1363.6999999999996, 4058.660000000013, 4.208281898776793, 5.6713174026484126, 1.2835807744641454], "isController": false}, {"data": ["Register Account-1", 400, 200, 50.0, 895.9799999999999, 380, 4508, 870.0, 1115.6000000000001, 1177.8, 3954.5400000000004, 2.9167699689364, 2.8355903360119004, 0.9143390234654144], "isController": false}, {"data": ["Fetch Products-0", 600, 0, 0.0, 25.163333333333334, 18, 60, 24.0, 28.0, 44.94999999999993, 54.0, 4.2306553285103865, 1.7627730535459942, 1.5975130797760573], "isController": false}, {"data": ["Fetch Order By Product ID-0", 200, 0, 0.0, 24.77, 19, 51, 23.5, 30.0, 37.89999999999998, 49.0, 1.494947078873408, 0.6160817063325958, 0.490529510255337], "isController": false}, {"data": ["Delete Order By ID", 200, 0, 0.0, 916.8449999999999, 467, 4616, 771.5, 1603.3, 1666.8499999999997, 4557.63000000001, 1.4559855566232782, 0.9597561042194461, 0.9953026265979441], "isController": false}, {"data": ["Register Account-0", 400, 0, 0.0, 24.24, 18, 68, 23.0, 26.0, 33.0, 54.98000000000002, 2.941089967942119, 1.1689683759301197, 1.0454655745419252], "isController": false}, {"data": ["Fetch Order By Product ID-1", 200, 200, 100.0, 482.7000000000001, 213, 3407, 443.5, 674.9000000000001, 727.6499999999999, 1180.5300000000022, 1.488471786017296, 0.49276556197252275, 0.4884048047869252], "isController": false}, {"data": ["Fetch Order By ID-1", 200, 200, 100.0, 867.6399999999999, 514, 3947, 781.5, 1017.1, 1213.5999999999997, 3907.99, 1.483910698254179, 0.5318312756438318, 0.463722093204431], "isController": false}, {"data": ["Edit Order By ID-0", 200, 0, 0.0, 23.980000000000008, 18, 48, 23.0, 27.900000000000006, 31.94999999999999, 47.91000000000008, 1.494064827472864, 0.5923733593300613, 0.5719466917669558], "isController": false}, {"data": ["Fetch Product By ID-1", 200, 0, 0.0, 415.91499999999996, 111, 1115, 415.0, 586.5, 655.0, 862.95, 1.48822811560556, 1.2702259502336517, 0.2441624252165372], "isController": false}, {"data": ["Fetch Product By ID-0", 200, 0, 0.0, 23.865, 19, 47, 23.0, 27.0, 30.0, 46.98000000000002, 1.4939197466312109, 0.5966925550509427, 0.24509620843168303], "isController": false}, {"data": ["Fetch Order By ID", 400, 200, 50.0, 927.0075000000004, 531, 3970, 839.5, 1222.5000000000002, 1503.5499999999995, 3896.010000000002, 2.8751329749000893, 2.809150919323769, 1.3659689377821225], "isController": false}, {"data": ["Fetch Order By ID-0", 200, 0, 0.0, 24.08, 19, 55, 23.0, 26.0, 32.94999999999999, 52.99000000000001, 1.4925484518541183, 0.5917721400905978, 0.466421391204412], "isController": false}, {"data": ["Create Order-0", 200, 0, 0.0, 23.65000000000001, 19, 40, 23.0, 26.0, 31.899999999999977, 37.97000000000003, 1.4717786444918686, 0.5763508168371477, 0.6252184671425418], "isController": false}, {"data": ["Edit Order By ID", 200, 200, 100.0, 841.99, 463, 4227, 753.5, 1102.7000000000003, 1233.6, 4017.140000000001, 1.484769972012086, 1.1208273323880298, 1.0831280948174105], "isController": false}, {"data": ["Edit Order By Id-1", 200, 0, 0.0, 883.7949999999997, 492, 3822, 800.0, 1244.4, 1459.0, 3391.310000000014, 1.45349893531203, 1.7459020414392548, 0.5180928822157138], "isController": false}, {"data": ["Create Order-1", 200, 0, 0.0, 906.4249999999997, 409, 4621, 742.5, 1614.8000000000002, 1761.6499999999996, 4100.860000000001, 1.4596941940663433, 3.127508849396052, 0.5117482574900559], "isController": false}, {"data": ["Fetch Orders", 200, 0, 0.0, 978.3599999999997, 399, 4685, 857.5, 1616.3, 1833.85, 4036.0400000000172, 1.4652444027663816, 3.713192602713632, 0.93581039004806], "isController": false}, {"data": ["Delete Order By ID-0", 200, 0, 0.0, 23.71999999999999, 19, 40, 23.0, 26.900000000000006, 31.0, 37.97000000000003, 1.4719627887806996, 0.5850477099938914, 0.5649232187410302], "isController": false}, {"data": ["Get Orders", 200, 0, 0.0, 846.4650000000005, 427, 1318, 824.0, 1102.7, 1180.7499999999998, 1304.95, 1.4858951403799434, 0.38598447982525874, 0.4832061345180871], "isController": false}, {"data": ["Delete Order By ID-1", 200, 0, 0.0, 893.045, 444, 4592, 746.5, 1581.2, 1642.1499999999999, 4533.62000000001, 1.4562399883500803, 0.38112530945099754, 0.4365875746322994], "isController": false}, {"data": ["Login Account", 200, 0, 0.0, 636.3100000000002, 189, 1305, 588.0, 973.7, 1102.35, 1261.91, 1.4931278789371916, 0.7071943567231815, 0.3966120928426915], "isController": false}, {"data": ["Fetch Product By ID", 200, 0, 0.0, 439.8900000000001, 138, 1137, 438.5, 611.0, 679.9, 884.97, 1.4879513142329983, 1.8642983751571647, 0.4882340249827025], "isController": false}, {"data": ["Edit Order By Id-0", 200, 0, 0.0, 23.484999999999996, 19, 36, 23.0, 26.0, 28.0, 35.0, 1.4901353042856291, 0.5922705750432139, 0.6024570468498539], "isController": false}, {"data": ["Register Account", 800, 600, 75.0, 709.4312499999997, 20, 4531, 749.0, 1133.9, 1331.6499999999996, 2132.86, 5.762899891225265, 4.884958110921416, 3.1009353906885946], "isController": false}, {"data": ["Create Order", 200, 0, 0.0, 930.1600000000003, 430, 4645, 765.5, 1640.7, 1787.5999999999997, 4125.830000000001, 1.4594066052742953, 3.69839857488945, 1.1316101997927643], "isController": false}, {"data": ["Fetch Order By Product ID", 200, 200, 100.0, 507.5749999999999, 235, 3431, 466.0, 703.7, 752.8499999999999, 1206.4900000000023, 1.4881727470924826, 1.1059565044310344, 0.9766133652794416], "isController": false}, {"data": ["Fetch Orders-1", 200, 0, 0.0, 954.5749999999999, 380, 4661, 832.5, 1597.2, 1807.75, 4012.0400000000172, 1.465502081012955, 3.139952700920335, 0.4679874809484729], "isController": false}, {"data": ["Edit Order By ID-1", 200, 200, 100.0, 817.8699999999998, 439, 4206, 731.0, 1071.3000000000002, 1210.4499999999998, 3993.140000000001, 1.4850345641794813, 0.5322340674354196, 0.5148313186364413], "isController": false}, {"data": ["Fetch Orders-0", 200, 0, 0.0, 23.689999999999998, 18, 42, 23.0, 26.0, 31.0, 38.960000000000036, 1.477312178222941, 0.5785177572923822, 0.47175886941299], "isController": false}, {"data": ["Fetch Products", 600, 0, 0.0, 968.5783333333336, 366, 4497, 926.5, 1233.9, 1398.6499999999996, 4084.680000000013, 4.206688634929538, 7.421957161887401, 2.8715579646638156], "isController": false}, {"data": ["Edit Order By Id", 200, 0, 0.0, 907.3749999999998, 518, 3846, 821.0, 1268.3, 1481.95, 3415.2900000000145, 1.4532454604244929, 2.3232058776512647, 1.1055451305377735], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 800, 40.0, 9.090909090909092], "isController": false}, {"data": ["500/Internal Server Error", 600, 30.0, 6.818181818181818], "isController": false}, {"data": ["404/Not Found", 600, 30.0, 6.818181818181818], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8800, 2000, "400/Bad Request", 800, "500/Internal Server Error", 600, "404/Not Found", 600, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Register Account-1", 400, 200, "404/Not Found", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Fetch Order By Product ID-1", 200, 200, "500/Internal Server Error", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Fetch Order By ID-1", 200, 200, "400/Bad Request", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Fetch Order By ID", 400, 200, "400/Bad Request", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Edit Order By ID", 200, 200, "400/Bad Request", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Register Account", 800, 600, "404/Not Found", 400, "500/Internal Server Error", 200, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Fetch Order By Product ID", 200, 200, "500/Internal Server Error", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Edit Order By ID-1", 200, 200, "400/Bad Request", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
