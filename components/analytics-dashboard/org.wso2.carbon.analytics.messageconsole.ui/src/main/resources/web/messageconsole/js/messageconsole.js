var tableLoaded = false;

function createMainJTable(fields) {
    $('#AnalyticsTableContainer').jtable({
                                             title: $("#tableSelect").val(),
                                             paging: true,
                                             pageSize: 10,
                                             actions: {
                                                 // For Details: http://jtable.org/Demo/FunctionsAsActions
                                                 listAction: function (postData, jtParams) {
                                                     return listActionMethod(postData);
                                                 },
                                                 createAction: '/GettingStarted/CreatePerson',
                                                 updateAction: '/GettingStarted/UpdatePerson',
                                                 deleteAction: '/GettingStarted/DeletePerson'
                                             },
                                             fields: fields
                                         });
    $('#AnalyticsTableContainer').jtable('load');
    tableLoaded = true;
}

function getArbitraryFields(rowData) {
    var $img =
            $('<img src="/carbon/messageconsole/themes/metro/list_metro.png" title="Show Arbitrary Fields" />');
    $img.click(function () {
        $('#AnalyticsTableContainer').jtable('openChildTable',
                                             $img.closest('tr'), //Parent row
                                             {
                                                 title: 'Arbitrary Fields',
                                                 actions: {
                                                     listAction: function (postData, jtParams) {
                                                         return listActionMethod(postData);
                                                     },
                                                     deleteAction: '/Demo/DeleteExam',
                                                     updateAction: '/Demo/UpdateExam',
                                                     createAction: '/Demo/CreateExam'
                                                 },
                                                 fields: {
                                                     PersonId: {
                                                         key: true,
                                                         list: false
                                                     },
                                                     Name: {
                                                         title: 'Name'
                                                     },
                                                     Value: {
                                                         title: 'Value'
                                                     },
                                                     Type: {
                                                         title: 'Type',
                                                         options: ["String", "boolean", "int", "long"]
                                                     }
                                                 }
                                             }, function (data) { //opened handler
                    data.childTable.jtable('load');
                });
    });
    return $img;
}

function createJTable(table) {
    if (table != '-1') {
        $.getJSON("/carbon/messageconsole/messageconsole_ajaxprocessor.jsp?type=tableInfo&tableName=" + table,
                  function (data, status) {
                      var fields = {
                          ArbitraryFields: {
                              title: '',
                              width: '1%',
                              sorting: false,
                              edit: false,
                              create: false,
                              display: function (rowData) {
                                  return getArbitraryFields(rowData);
                              }
                          }
                      };
                      $.each(data.columns, function (key, val) {
                          fields[val.name] = {
                              title: val.name
                          };
                      });

                      if (data) {
                          if (tableLoaded == true) {
                              $('#AnalyticsTableContainer').jtable('destroy');
                          }
                          createMainJTable(fields);
                      }
                  });
    }
}

function listActionMethod(postData) {
    return $.Deferred(function ($dfd) {
        $.ajax({
                   url: '/carbon/messageconsole/messageconsole_ajaxprocessor.jsp?type=getRecords&tableName=' + $("#tableSelect").val(),
                   type: 'GET',
                   dataType: 'json',
                   data: postData,
                   success: function (data) {
                       $dfd.resolve(data);
                   },
                   error: function () {
                       $dfd.reject();
                   }
               });
    });
}