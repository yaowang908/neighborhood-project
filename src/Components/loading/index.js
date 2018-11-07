import '../../styles/loading.scss'
import $ from 'jquery';
import templateData from '../templates/loading-template.html';

export default function loadding() {
    $('body').append($(templateData));
}