let banActividad = -1;

$(document).ready(function () {
    mostrarActividades();
});

function mostrarActividades() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:8000/verActividades'
    }).done((response) => {
        const dataJson = JSON.parse(response);
        const usuarios = dataJson.data;
        const table = document.getElementById('actividadesTb');
        const tbody = table.getElementsByTagName('tbody')[0];
        let html = '';

        usuarios.forEach(actividad => {
            html += '<tr>';
            html += '   <td>' + actividad.id + '</td>';
            html += '   <td>' + actividad.descripcion + '</td>';
            html += '   <td>' + actividad.nota + '</td>';
            html += '   <td>';
            html += '      <button onclick="modificar(' + actividad.id + ')">Modificar</button>';
            html += '   </td>';
            html += '   <td>';
            html += '      <button onclick="eliminar(' + actividad.id + ')">Eliminar</button>';
            html += '   </td>';
            html += '</tr>';
        });

        tbody.innerHTML = html;
    }).fail((error) => {
        console.error(error);
    });
}

document.getElementById('registrar').addEventListener('click', () => {
    banActividad = 0;
    document.getElementById('tituloModal').innerText = 'Registrar';
});


document.getElementById('guardar').addEventListener('click', () => {
    let formulario = document.forms['formularioActividad'];
    let descripcion = formulario['descripcion'].value;
    let nota = formulario['nota'].value;
    let codigoEstudiante = formulario['codigoEstudiante'].value;

    if (descripcion && nota && codigoEstudiante) {
        if (banActividad == 0) {
            $.ajax({
                url: 'http://localhost:8000/agregarActividades',
                method: 'post',
                data: {
                    descripcion: descripcion,
                    nota: nota,
                    codigoEstudiante: codigoEstudiante
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg);
                mostrarActividades();
                location.reload();
            });
        } else if (banActividad == 1) {
            let formularioModificar = document.forms['formularioActividad'];
            let descripcionModificar = formularioModificar['descripcion'].value;
            let notaModificar = formularioModificar['nota'].value;
            $.ajax({
                url: 'http://localhost:8000/actualizarActividades/' + id ,
                method: 'put',
                data: {
                    descripcion: descripcionModificar,
                    nota: notaModificar
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg);
                mostrarActividades();
                location.reload();
            });
        }
    } else {
        alert('No pueden haber campos vacios');
    }
});

function modificar(Id) {
    document.getElementById('tituloModal').innerText = 'Modificar';
    banActividad = 1;
    id = Id;
}

function eliminar(id) {
    $.ajax({
        url: 'http://localhost:8000/eliminarActividades/' + id,
        method: 'delete',
    }).done(response => {
        const dataJson = JSON.parse(response);
        const msg = dataJson.data;
        alert(msg);
        mostrarActividades();
        location.reload();

    });
}
