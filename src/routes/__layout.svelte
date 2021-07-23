<svelte:head>
    <title>Welcome to Spacebay</title>
	<link rel="stylesheet" type="text/css" href="/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="/css/style.css">
</svelte:head>

<script>
    import Header from '$lib/Header.svelte';
    import Footer from '$lib/Footer.svelte';
</script>

<div class="container-fluid px-0 pt-3 d-flex flex-column align-items-center">
    <Header></Header>

    <slot></slot>
    
    <Footer></Footer>
</div>
