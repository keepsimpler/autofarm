<svelte:head>
    <link rel="stylesheet" type="text/css" href="/static/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="/static/css/style.css">
</svelte:head>

<script>
    import Card from '$lib/Card.svelte';
    import LeafletMap from '$lib/LeafletMap.svelte';

    import { warehouses } from '../data.js';
</script>

<!-- <div class="container-fluid px-0 pt-3 d-flex flex-column align-items-center"> -->
    <div id="select" class="select-wrap">
        <div class="row no-gutters">
            <div class="col d-flex align-items-center">
                <div class="text">6836条记录</div>
                <div class="select-box pointer">
                    <div>仓库面积不限</div>
                    <div class="ml-auto"><img src="/static/images/down.svg" alt=""></div>
                </div>
                <div class="select-box pointer">
                    <div>仓库价格不限</div>
                    <div class="ml-auto"><img src="/static/images/down.svg" alt=""></div>
                </div>
                <div class="select-box pointer" style="width: 7.25rem">
                    <div>更多</div>
                    <div class="ml-auto"><img src="/static/images/down.svg" alt=""></div>
                </div>

                <div class="select-box active position-relative d-none"><!-- 选择后selectbox样式-->
                    <div>仓库面积不限</div>
                    <div class="ml-auto"><img src="/static/images/up.svg" alt=""></div>
                    <div class="select-show position-absolute">
                        <div class="select-content">仓库面积不限</div>
                        <div class="select-content">0-5000㎡</div>
                        <div class="select-content">5001-10,000㎡</div>
                        <div class="select-content">20,000㎡以上</div>
                    </div>
                </div>
                <div class="select-box active position-relative d-none" style="width: 7.25rem"><!-- 选择后selectbox样式-->
                    <div>更多</div>
                    <div class="ml-auto"><img src="/static/images/up.svg" alt=""></div>
                    <div class="select-show position-absolute pb-0">
                        <div class="custom-control custom-checkbox ml-3 mb-3 mt-2">
                            <input type="checkbox" class="custom-control-input" id="customCheck1">
                            <label class="custom-control-label" for="customCheck1">特征1</label>
                        </div>
                        <div class="custom-control custom-checkbox ml-3 mb-3 mt-1">
                            <input type="checkbox" class="custom-control-input" id="customCheck2">
                            <label class="custom-control-label" for="customCheck2">特征2</label>
                        </div>
                        <div class="custom-control custom-checkbox ml-3 mb-3 mt-1">
                            <input type="checkbox" class="custom-control-input" id="customCheck3">
                            <label class="custom-control-label" for="customCheck3">特征3</label>
                        </div>
                        <div class="custom-control custom-checkbox ml-3 mb-4 mt-1">
                            <input type="checkbox" class="custom-control-input" id="customCheck4">
                            <label class="custom-control-label" for="customCheck4">特征4</label>
                        </div>
                        <div class="mt-auto confirm pointer">确认</div>
                    </div>
                </div>

            </div>

        </div>

    </div>
    <div id="list" class="row no-gutters w-100">
        <div class="col-7 pb-4">
            <div class="row no-gutters p-4 mt-3 w-100">
                {#each warehouses as warehouse}
                <div class="col-6 no-gutters d-flex justify-content-center">
                    <div class="card border-0" style="width: 92%">
                        <a href="/list/detail">
                        <img src={warehouse.picture} class="card-img-top" alt={warehouse.name}>
                        </a>
                        <div class="card-body">
                            <p class="card-text">{warehouse.name}</p>
                            <p class="price-text">CAD {warehouse.price}/㎡·天</p>
                            <p class="location-text d-flex flex-row"><span class="d-flex align-items-center mr-1">
                                <img src="/static/images/location.svg" alt="">{warehouse.address}</span><span
                                    class="d-flex align-items-center ml-3"><img src="/static/images/square.svg" alt="">{warehouse.area}㎡</span>
                            </p>
                        </div>
                    </div>
                </div>
                {:else}
                    <p>loading</p>
                {/each}
        
            </div>
            <div class="mt-auto d-flex flex-row justify-content-center w-100">
                <div class="d-flex flex-row align-items-center mb-3">
                    <div class="page-no-bg">
                        <img src="/static/images/left.svg" alt="">
                    </div>
                    <div class="page-no ml-3 page-no-active">1</div>
                    <div class="page-no ml-3">2</div>
                    <div class="page-no ml-3">3</div>
                    <div class="page-no ml-3">4</div>
                    <div class="page-no ml-3">5</div>
                    <div class="ml-3">...</div>
                    <div class="page-no ml-3">10</div>
                    <div class="page-no-bg ml-3">
                        <img src="/static/images/right.svg" alt="">
                    </div>
                    <div class="ml-3">跳至</div>
                    <div class="page-no-box ml-3"><input type="number" class="border-0 text-center"></div>
                    <div class="ml-3">页</div>
                </div>
            </div>
        </div>
        <div class="col-5 ">
            <LeafletMap></LeafletMap>
        </div>

    </div>
<!-- </div> -->


