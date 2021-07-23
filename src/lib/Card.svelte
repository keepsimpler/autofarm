<script>
    export let picture;
    export let name;
    export let price;
    export let address;
    export let area;
</script>

<div class="col-4 no-gutters d-flex justify-content-center">
    <div class="card border-0" style="width: 22.25rem">
        <img src={picture} class="card-img-top" alt={name}>
        <div class="card-body">
            <p class="card-text">{name}</p>
            <p class="price-text">CAD {price}/㎡·天</p>
            <p class="location-text d-flex flex-row"><span class="d-flex align-items-center mr-1"><img
                    src="/static/images/location.svg" alt="">{address}</span><span
                    class="d-flex align-items-center ml-3">
                    <img src="/static/images/square.svg" alt="">{area}㎡</span></p>
        </div>
    </div>
</div>
