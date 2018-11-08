import '../../styles/side-panel.scss'
import $ from 'jquery';
import templateData from '../templates/side-panel-template.html';
import ko from 'knockout';

export default function sidePanel() {
    $('body').append($(templateData));
}