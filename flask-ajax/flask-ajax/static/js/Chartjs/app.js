// using JS Document API
document.getElementById("demo").innerHTML = "AirBnb Listings - AUSTIN";

// using JQuery
$(document).ready( function () {
    $.ajax({
        type: "GET",
        dataType: "json",
        crossOrigin: true,
        url: "/ajax",
        success: function (data) {
            console.log(data)

            // build the rows from each response element
            $.each(data, function(i, item) {
                var body = "<tr>";
                body += "<td>" + item.host_id + "</td>";
                body += "<td>" + item.neighbourhood+ "</td>";
                body += "<td>" + item.room_type + "</td>";
                body += "<td>" + item.price + "</td>";
                body += "<td>" + item.number_of_reviews + "</td>";
                body += "</tr>";
                $( "#dtable tbody" ).append(body);
            });

            /*DataTables instantiation.*/
            $( "#dtable" ).DataTable();
        },
        error: function (request, status, error) {
            alert(error)
            alert(request.responseText);
        }
    });
});