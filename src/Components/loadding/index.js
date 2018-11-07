import '../../styles/loading.scss'
import $ from 'jquery';

export default function loadding() {
    $('body').append($('<div class="loading"><div class="circle top"></div><div class="cover"></div><div class="circle bottom"></div><p class="loadingP">Loading...</p></div>'));
}