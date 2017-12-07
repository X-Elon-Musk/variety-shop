/**
 * Created by Administrator on 2017/6/9.
 */
document.write((function (){/*
    <div>hello world!--index-2</div>
*/}).toString().replace(/^.+?\*|\\(?=\/)|\*.+?$/gi, ""));
document.write((function (){/*
 <script type='text/javascript'>
    if (1) {
        console.log(1);
    } else{
        console.log(0);
    }

 </script>
*/}).toString().replace(/^.+?\*|\\(?=\/)|\*.+?$/gi, ""));