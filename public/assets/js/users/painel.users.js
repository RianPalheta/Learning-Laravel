var qt_result_pg = 50;
var page = 1;

$(document).ready(function() {
    if(localStorage.getItem('current_page_list_users')) {
        page = localStorage.getItem('current_page_list_users');
    }
    if(localStorage.getItem('qt_result_pg_list_users')) {
        qt_result_pg = localStorage.getItem('qt_result_pg_list_users');
    }

    if($('table').length > 0) {
        [...$('select').children()].forEach(item => {
            if(item.getAttribute('value') === qt_result_pg) {
                item.setAttribute('selected','selected')
            }
        });
        list_users(page, qt_result_pg);
    }
});

$('select').on('change', function() {
    let option = $('select').val();
    localStorage.setItem('qt_result_pg_list_users', option);
    list_users(1, option);
});

var typingTimer; //timer identifier
var doneTypingInterval = 500; //time in ms, 1 second for example

$('#search').on('submit', function(e) {
    e.preventDefault();
});

//on keyup, start the countdown
$('#search').keyup(function() {
  clearTimeout(typingTimer);
  if ($('#search').val) {
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  }
});

//user is "finished typing," do something
function doneTyping() {
    let serach = $('#search input').val();
    list_users(1, localStorage.getItem('qt_result_pg_list_users'), serach);
}


function list_users(page, qt, search = null) {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url,
        type:'GET',
        data: {page, qt, search},
        dataType:'JSON',
        beforeSend: function() {
            $('.content-load').append("<div id='content-load' class='position-absolute card d-flex justify-content-center align-items-center' style='z-index: 3; width:100%; height:100%; top:0; left:0;'><i class='fas fa-circle-notch rotafe-infinit' style='font-size:2.5rem'></i></div>");
        },
        success:function(response) {
            let last_page = response.last_page;
            let current_page = response.current_page
            let data = response.data;
            localStorage.setItem('current_page_list_users', current_page);

            $('tbody').html('');
            $('#content-load').remove();
            $('.card-header ul').html('');

            if(parseInt(response.total) > 0) {
                data.map(i => {
                    let url_edit_user = url_edit.replace('1', i.id);
                    let date_creat = i.created_at.split('-');
                    date_creat[2] = date_creat[2].substring(0,2);
                    let table = `
                    <tr>
                        <td>${i.name}</td>
                        <td>${i.email}</td>
                        <td>${i.telephone === null ? '(___) _____-____' : i.telephone}</td> <!-- (000) 00000-0000 -->
                        <td>${date_creat[2]}/${date_creat[1]}/${date_creat[0]}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <a title="Editar" href="${url_edit_user}" class="btn btn-sm btn-info"><i class="fas fa-user-edit"></i></a>
                                <button onclick="delete_user(${i.id})" title="${i.id === logged ? 'Você não pode deletar o seu usuário' : 'Deletar'}" class="btn btn-sm btn-danger ${i.id === logged ? 'disabled' : ''}" ${i.id === logged ? 'disabled' : ''}><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                    `
                    $('tbody').append(table);
                });
            } else {
                $('table').html("<div class='alert alert-light' role='alert'>Não há usuários para mostrar.</div>");
                return;
            }

            const max_links = 2;
            if(last_page > 1) {
                $('.card-header ul').append(`
                <li class="page-item ${current_page === 1 ? 'disabled' : ''}"><a class="page-link" href="1"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">«</font></font></a></li>
                `)
                for(let page_ant = current_page - max_links; page_ant <= current_page -1; page_ant++) {
                    if(page_ant >= 1) {
                        $('.card-header ul').append(`
                            <li class="page-item"><a class="page-link" href="${page_ant}"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${page_ant}</font></font></a></li>
                        `)
                    }
                }
                $('.card-header ul').append(`
                    <li class="page-item active"><a class="page-link" href="${current_page}"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${current_page}</font></font></a></li>
                `)
                for(let page_dep = current_page + 1; page_dep <= current_page + max_links; page_dep++) {
                    if(page_dep <= last_page) {
                        $('.card-header ul').append(`
                            <li class="page-item"><a class="page-link" href="${page_dep}"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${page_dep}</font></font></a></li>
                        `)
                    }
                }
                $('.card-header ul').append(`
                    <li class="page-item ${current_page === last_page ? 'disabled' : ''}"><a class="page-link" href="${last_page}"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">»</font></font></a></li>
                `)
            }

            $('#info-pages').html(`Mostrando ${current_page} de ${last_page} páginas`);
            $('h1 span').addClass('badge bg-secondary');
            $('h1 span').html(`${response.total}`);

            const page_link = [...$('.page-link')];
            page_link.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    let attr = item.getAttribute('href');
                    if(parseInt(current_page) != parseInt(attr)) {
                        list_users(attr, localStorage.getItem('qt_result_pg_list_users'));
                    }
                })
            });

            const btn_del = [...$('button[data-delete]')];
            btn_del.forEach(btn => {
                let id = btn.getAttribute('data-delete');
                btn.onclick = delete_user(id);
            });
        }
    })
}

function delete_user(id) {
    if(id === logged) return;

    let url_del_user = url_del.replace('1', id);
    let c = confirm('Tem certeza que você quer excluir esse usuário?');
    if(c) {
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: "DELETE",
            url: url_del_user,
            success: function (response) {
                let r = JSON.parse(response);
                if(r.success === false) {
                    return alert(r.msg);
                }
                list_users(
                    localStorage.getItem('current_page_list_users'),
                    localStorage.getItem('qt_result_pg_list_users')
                );
            }
        });
    }
}
