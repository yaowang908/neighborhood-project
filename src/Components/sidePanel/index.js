import '../../styles/side-panel.scss';
import '../../styles/css-icon.css';
import $ from 'jquery';
import templateData from '../templates/side-panel-template.html';

export default function sidePanel() {
    $('body').append($(templateData));
}