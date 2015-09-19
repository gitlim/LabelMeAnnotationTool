<body>
  <script>
    function submit_AMT() {
	parent.document.getElementById('comment').value = document.getElementById('comment').value;
	parent.submit_AMT();
    }
  </script>
  Please let us know if there is any comment (e.g. anything to improve?).<br>
  <textarea id="comment" rows=10 cols=80>
  </textarea>
  <br>
  <button onclick="submit_AMT();">Done</button>
</body>
