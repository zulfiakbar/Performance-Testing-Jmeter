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

    var data = {"OkPercent": 68.29268292682927, "KoPercent": 31.70731707317073};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6009146341463415, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5025, 500, 1500, "Delete Product"], "isController": false}, {"data": [0.0, 500, 1500, "Get Profile-1"], "isController": false}, {"data": [1.0, 500, 1500, "Get Profile-0"], "isController": false}, {"data": [0.0, 500, 1500, "Create Offer"], "isController": false}, {"data": [1.0, 500, 1500, "Get Category-0"], "isController": false}, {"data": [0.0, 500, 1500, "Get Profile"], "isController": false}, {"data": [1.0, 500, 1500, "List Categories-0"], "isController": false}, {"data": [0.915, 500, 1500, "List Categories-1"], "isController": false}, {"data": [0.96, 500, 1500, "Get Category-1"], "isController": false}, {"data": [0.5875, 500, 1500, "List Products-1"], "isController": false}, {"data": [1.0, 500, 1500, "List Products-0"], "isController": false}, {"data": [1.0, 500, 1500, "Update Profile-0"], "isController": false}, {"data": [0.0, 500, 1500, "Registration"], "isController": false}, {"data": [0.0, 500, 1500, "Update Profile-1"], "isController": false}, {"data": [0.5975, 500, 1500, "Create Product"], "isController": false}, {"data": [1.0, 500, 1500, "Create Product-0"], "isController": false}, {"data": [0.63, 500, 1500, "Create Product-1"], "isController": false}, {"data": [0.9075, 500, 1500, "Update Product-1"], "isController": false}, {"data": [0.0, 500, 1500, "List Offers-1"], "isController": false}, {"data": [1.0, 500, 1500, "List Offers-0"], "isController": false}, {"data": [0.92, 500, 1500, "Delete Product-1"], "isController": false}, {"data": [0.0, 500, 1500, "Update Profile"], "isController": false}, {"data": [0.68, 500, 1500, "Delete Product-2"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product-0"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Product-0"], "isController": false}, {"data": [0.0, 500, 1500, "Create Offer-1"], "isController": false}, {"data": [1.0, 500, 1500, "Create Offer-0"], "isController": false}, {"data": [0.8525, 500, 1500, "Update Product"], "isController": false}, {"data": [0.0, 500, 1500, "Update Offer"], "isController": false}, {"data": [0.84, 500, 1500, "Get Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product-0"], "isController": false}, {"data": [1.0, 500, 1500, "Session-0"], "isController": false}, {"data": [0.8675, 500, 1500, "Get Product-1"], "isController": false}, {"data": [0.0, 500, 1500, "Session-1"], "isController": false}, {"data": [0.0, 500, 1500, "List Offers"], "isController": false}, {"data": [0.94, 500, 1500, "Get Category"], "isController": false}, {"data": [0.885, 500, 1500, "List Categories"], "isController": false}, {"data": [0.5525, 500, 1500, "List Products"], "isController": false}, {"data": [0.0, 500, 1500, "Update Offer-1"], "isController": false}, {"data": [0.0, 500, 1500, "Session"], "isController": false}, {"data": [1.0, 500, 1500, "Update Offer-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8200, 2600, 31.70731707317073, 336.9610975609749, 29, 4036, 288.0, 763.0, 949.9499999999998, 1396.0, 105.86929015932037, 272.86889133388854, 34.86293073953573], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Product", 200, 0, 0.0, 985.5, 207, 1888, 978.0, 1321.9, 1460.3999999999996, 1602.3900000000006, 2.856693948093871, 42.91245304309323, 1.392080351659025], "isController": false}, {"data": ["Get Profile-1", 200, 200, 100.0, 383.3149999999998, 35, 1315, 328.0, 797.1, 896.6499999999999, 1273.7200000000003, 2.8993490961279194, 2.668505412722344, 1.7806930078572363], "isController": false}, {"data": ["Get Profile-0", 200, 0, 0.0, 37.16000000000003, 29, 145, 32.0, 42.900000000000006, 73.0, 139.8800000000001, 2.8995172303811416, 1.1128029995505748, 0.4643758064282297], "isController": false}, {"data": ["Create Offer", 200, 200, 100.0, 315.17999999999995, 65, 1081, 313.5, 513.7, 775.75, 878.94, 2.8325803390598665, 2.0801761864970896, 1.3996930191057544], "isController": false}, {"data": ["Get Category-0", 200, 0, 0.0, 35.450000000000024, 29, 123, 32.0, 35.900000000000006, 65.69999999999993, 101.92000000000007, 2.8442624116500985, 1.1027072045166888, 0.4666368019113444], "isController": false}, {"data": ["Get Profile", 200, 200, 100.0, 420.66499999999957, 67, 1346, 360.5, 828.1, 929.95, 1304.7300000000002, 2.89792074186771, 3.779381067521553, 2.2439358744475837], "isController": false}, {"data": ["List Categories-0", 200, 0, 0.0, 35.15999999999998, 29, 128, 32.0, 36.0, 47.74999999999994, 121.97000000000003, 2.8467724717101985, 1.0981202405522739, 0.4614885061561455], "isController": false}, {"data": ["List Categories-1", 200, 0, 0.0, 314.3550000000001, 56, 860, 287.5, 554.0, 680.3999999999999, 845.5700000000004, 2.841595271585468, 2.9692450591762216, 0.4606492334796755], "isController": false}, {"data": ["Get Category-1", 200, 0, 0.0, 289.0150000000001, 41, 790, 288.5, 482.6, 553.75, 785.5700000000004, 2.838369073130579, 2.0206748577267506, 0.4656699260604857], "isController": false}, {"data": ["List Products-1", 200, 0, 0.0, 664.775, 362, 1312, 619.0, 946.7, 1191.249999999999, 1297.8000000000002, 2.7841581401823623, 35.11811736531635, 0.4459003271385815], "isController": false}, {"data": ["List Products-0", 200, 0, 0.0, 36.495000000000005, 29, 400, 32.0, 35.0, 66.49999999999989, 107.83000000000015, 2.7991602519244223, 1.074287088873338, 0.6123163051084675], "isController": false}, {"data": ["Update Profile-0", 200, 0, 0.0, 37.990000000000016, 30, 377, 32.0, 41.900000000000006, 74.89999999999998, 126.88000000000011, 2.880682145532062, 1.1055742999942386, 0.9508501613182002], "isController": false}, {"data": ["Registration", 200, 200, 100.0, 1277.3149999999994, 439, 4036, 1113.5, 1779.3000000000002, 2808.399999999994, 3858.2400000000016, 2.7174651485094703, 1.6533015503138673, 0.8571691825864833], "isController": false}, {"data": ["Update Profile-1", 200, 200, 100.0, 394.6299999999999, 37, 1328, 365.0, 740.0, 847.95, 1246.860000000001, 2.8801428550856123, 2.654878556976426, 1.8655956585446638], "isController": false}, {"data": ["Create Product", 200, 0, 0.0, 637.755, 314, 1254, 623.0, 857.1, 933.9, 1042.8300000000002, 2.7864855451062347, 36.216583942877044, 1.6082157784743991], "isController": false}, {"data": ["Create Product-0", 200, 0, 0.0, 39.364999999999995, 30, 429, 32.0, 38.70000000000002, 89.0, 132.97000000000003, 2.818012737417573, 1.081522466606549, 1.0787705010426647], "isController": false}, {"data": ["Create Product-1", 200, 0, 0.0, 598.2799999999994, 282, 1222, 587.5, 811.7, 898.6499999999999, 1010.8300000000002, 2.7879227187822355, 35.1652889681898, 0.5417935752320946], "isController": false}, {"data": ["Update Product-1", 200, 0, 0.0, 402.12, 61, 1022, 401.5, 559.9, 765.4999999999994, 968.95, 2.848799943024001, 3.61385852147283, 0.5703163948436721], "isController": false}, {"data": ["List Offers-1", 200, 200, 100.0, 320.5250000000002, 38, 948, 295.5, 541.6, 729.9, 873.7600000000002, 2.842402967468698, 1.2074661043446129, 0.49131379418160115], "isController": false}, {"data": ["List Offers-0", 200, 0, 0.0, 36.52499999999999, 29, 148, 32.0, 35.0, 84.5499999999999, 145.9000000000001, 2.848597065945022, 1.129424227318046, 0.49238445378151263], "isController": false}, {"data": ["Delete Product-1", 200, 0, 0.0, 359.915, 41, 922, 359.0, 546.6, 686.4999999999999, 901.6600000000003, 2.864180557942373, 1.9915005441943059, 0.40277539096064613], "isController": false}, {"data": ["Update Profile", 200, 200, 100.0, 432.90500000000026, 67, 1361, 399.0, 777.7, 881.0, 1278.870000000001, 2.878816230765909, 3.758513874094972, 2.814970609085544], "isController": false}, {"data": ["Delete Product-2", 200, 0, 0.0, 585.6450000000002, 134, 1369, 566.5, 839.0, 1012.6999999999995, 1146.4700000000005, 2.866397225327486, 39.94828392381116, 0.34990200504485913], "isController": false}, {"data": ["Update Product-0", 200, 0, 0.0, 35.059999999999974, 29, 117, 32.0, 36.0, 49.849999999999966, 108.94000000000005, 2.8499772001823986, 1.1104891629616962, 1.1967677696078431], "isController": false}, {"data": ["Delete Product-0", 200, 0, 0.0, 39.704999999999984, 29, 148, 32.0, 61.500000000000085, 111.79999999999995, 135.99, 2.8645497643907816, 1.1161673398358614, 0.6434047322362108], "isController": false}, {"data": ["Create Offer-1", 200, 200, 100.0, 275.2450000000001, 34, 1038, 274.0, 479.40000000000003, 589.3499999999997, 847.7900000000002, 2.8338646829613885, 0.9990479985830676, 0.5368845200141693], "isController": false}, {"data": ["Create Offer-0", 200, 0, 0.0, 39.81999999999999, 29, 411, 32.0, 35.0, 77.74999999999994, 375.6800000000003, 2.839416783792609, 1.0841913695926857, 0.8651348013118105], "isController": false}, {"data": ["Update Product", 200, 0, 0.0, 437.37000000000023, 92, 1053, 437.5, 616.1000000000001, 798.4499999999994, 1028.7100000000003, 2.8475020288451955, 4.721736762674944, 1.7657849495280267], "isController": false}, {"data": ["Update Offer", 200, 200, 100.0, 303.2799999999998, 64, 890, 306.0, 511.9, 602.55, 821.840000000001, 2.8156720305218847, 2.084257225718348, 1.2841004279821486], "isController": false}, {"data": ["Get Product", 200, 0, 0.0, 458.45999999999987, 112, 1050, 429.0, 739.9000000000001, 837.6999999999999, 1039.88, 2.8091465812686107, 4.656763986038541, 0.9327244508118434], "isController": false}, {"data": ["Get Product-0", 200, 0, 0.0, 34.75500000000002, 29, 133, 32.0, 35.0, 43.799999999999955, 129.73000000000025, 2.814562546616192, 1.0966898985350202, 0.4672613602780788], "isController": false}, {"data": ["Session-0", 200, 0, 0.0, 40.359999999999985, 29, 133, 32.0, 67.0, 72.94999999999999, 130.0, 2.783034620950685, 1.0816872843148169, 0.837084632082823], "isController": false}, {"data": ["Get Product-1", 200, 0, 0.0, 423.51499999999993, 81, 1019, 394.5, 708.9000000000001, 806.6999999999999, 1007.8800000000001, 2.810370266282583, 3.5637361237968097, 0.46656537623831934], "isController": false}, {"data": ["Session-1", 200, 200, 100.0, 505.64000000000016, 56, 2237, 406.0, 859.7, 1440.7999999999977, 2233.55, 2.7647985844231244, 1.0394994677762726, 0.5426997221377423], "isController": false}, {"data": ["List Offers", 200, 200, 100.0, 357.18000000000023, 70, 980, 343.5, 582.4000000000001, 761.95, 907.7500000000002, 2.841110874351872, 2.333373286455004, 0.9821809077349244], "isController": false}, {"data": ["Get Category", 200, 0, 0.0, 324.54500000000013, 76, 821, 321.5, 514.8, 584.8, 818.5500000000004, 2.837080644017306, 3.1196804737924673, 0.9309170863181785], "isController": false}, {"data": ["List Categories", 200, 0, 0.0, 349.6599999999997, 87, 892, 325.5, 595.4000000000001, 726.2999999999998, 877.6900000000003, 2.8403039125186393, 4.063520734218561, 0.9208797841369025], "isController": false}, {"data": ["List Products", 200, 0, 0.0, 701.4250000000002, 393, 1343, 652.5, 979.5000000000001, 1225.1999999999991, 1328.8100000000002, 2.782918446574923, 36.17053408988131, 1.0544651926475295], "isController": false}, {"data": ["Update Offer-1", 200, 200, 100.0, 267.3649999999999, 32, 860, 272.0, 478.70000000000005, 561.9499999999998, 772.890000000001, 2.8169807600214094, 0.993095756218485, 0.5501915546916815], "isController": false}, {"data": ["Session", 200, 200, 100.0, 546.1450000000001, 87, 2304, 439.5, 903.0, 1503.0999999999972, 2299.6200000000003, 2.7620112966262034, 2.111967622322575, 1.372913818342517], "isController": false}, {"data": ["Update Offer-0", 200, 0, 0.0, 35.83499999999998, 29, 137, 32.0, 35.0, 66.04999999999978, 132.0, 2.8359140150870625, 1.0994705703023084, 0.7394424238557087], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 400, 15.384615384615385, 4.878048780487805], "isController": false}, {"data": ["401/Unauthorized", 1400, 53.84615384615385, 17.073170731707318], "isController": false}, {"data": ["404/Not Found", 800, 30.76923076923077, 9.75609756097561], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8200, 2600, "401/Unauthorized", 1400, "404/Not Found", 800, "500/Internal Server Error", 400, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Get Profile-1", 200, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Offer", 200, 200, "404/Not Found", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Profile", 200, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Registration", 200, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update Profile-1", 200, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["List Offers-1", 200, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Profile", 200, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create Offer-1", 200, 200, "404/Not Found", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Offer", 200, 200, "404/Not Found", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Session-1", 200, 200, "500/Internal Server Error", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["List Offers", 200, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Offer-1", 200, 200, "404/Not Found", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Session", 200, 200, "500/Internal Server Error", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
