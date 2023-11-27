package lift;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 楼层请求, 属于数据结构, 保存并处理用户们按下的按钮信息
 *
 * @author flowerwine
 * @date 2023 年 11 月 24 日
 */
class LayerRequest {
    private final Lift lift;
    private final List<Layer> taskList;
    private final List<Layer> nextUpList;
    private final List<Layer> nextDownList;
    private static volatile LayerRequest layerRequest;

    private LayerRequest(int maxLayerNumber, Lift lift) {
        this.lift = lift;
        this.taskList = Collections.synchronizedList(new ArrayList<>(maxLayerNumber));
        this.nextUpList = Collections.synchronizedList(new ArrayList<>(maxLayerNumber));
        this.nextDownList = Collections.synchronizedList(new ArrayList<>(maxLayerNumber));
    }

    /**
     * 获取单例的楼层请求对象
     *
     * @return 返回生成的楼层请求对象
     */
    public static LayerRequest singleInstance(int maxLayerNumber, Lift lift) {
        if (layerRequest == null) {
            synchronized (LayerRequest.class) {
                if (layerRequest == null) {
                    layerRequest = new LayerRequest(maxLayerNumber, lift);
                }
            }
        }
        return layerRequest;
    }

    /**
     * 获取任务列表的第一个楼层
     *
     * @return 返回获取到的楼层, 没有楼层返回 null
     */
    Layer getLayer() {
        return !this.taskList.isEmpty() ? getFirst() : null;
    }

    /**
     * 获取第一个元素
     *
     * @return 返回第一个元素
     */
    Layer getFirst(List<Layer> list) {
        return list.get(0);
    }

    Layer getFirst() {
        return this.taskList.get(0);
    }

    /**
     * 移除第一个元素
     *
     * @return 返回被移除的元素
     */
    Layer removeFirst() {
        List<Layer> list = this.taskList;
        return !list.isEmpty() ? list.remove(0) : null;
    }

    void removeUpLayer() {
        this.removeLayer(this.nextUpList, this.nextDownList, MoveDirection.UP);
    }

    void removeDownLayer() {
        this.removeLayer(this.nextDownList, this.nextUpList, MoveDirection.DOWN);
    }

    /**
     * 电梯到达目标楼层时移除楼层, 从 usingList 中移除 <br/>
     * 当 usingList 中没有楼层时, 则设置 freeList 的第一个元素为 {@link Lift#targetLayer}, freeList 将成为 usingList<br/>
     *
     * @param nextUsingList 下一执行阶段要执行的任务
     * @param nextFreeList  下一执行阶段要执行的任务
     * @param moveDirection 当前电梯的运行状态
     */
    private void removeLayer(List<Layer> nextUsingList, List<Layer> nextFreeList,
                             MoveDirection moveDirection) {
        Lift lift = this.lift;
        List<Layer> taskList = this.taskList;

        // 当前任务执行完成, 将其移除
        removeFirst();

        // 移除后如果任务列表不为空, 就将列表第一个楼层设为目标楼层
        if (!taskList.isEmpty()) {
            lift.setTargetLayer(getFirst());
            return;
        }

        // 这段代码在下面的情况下生效 (电梯发生转向时):
        // 例如: 电梯从第一层移动到第七层, 在电梯到达第五层时, 此时在第三层按下向下的按钮, 将会添加到 nextFreeList 集合中
        if (!nextFreeList.isEmpty()) {
            taskList.addAll(nextFreeList);
            // 根据不同的移动状态排序
            if (MoveDirection.isMoveUp(moveDirection)) {
                this.reserveSort();
            } else if (MoveDirection.isMoveDown(moveDirection)) {
                this.sort();
            }
            lift.setTargetLayer(getFirst());
            nextFreeList.clear();
        }

        // 如果电梯反向运行列表没有元素 (nextFreeList 为空, empty), 就执行同向的任务列表
        // 例如: 电梯要从第一层移动到第七层, 并且电梯已经移动到第四层, 此时点击第一层的上升按钮和第三层的上升按钮,
        // 将会添加到 nextUsingList 集合中
        // 电梯移动过程: (1): 1 --- 上升 ---> 7  (2): 7 --- 下降 ---> 1  (3): 1 --- 上升 ---> 3
        if (taskList.isEmpty() && !nextUsingList.isEmpty()) {
            taskList.addAll(nextUsingList);
            if (MoveDirection.isMoveUp(moveDirection)) {
                this.sort();
            } else if (MoveDirection.isMoveDown(moveDirection)) {
                this.reserveSort();
            }
            lift.setTargetLayer(getFirst());
            nextUsingList.clear();
        }
    }

    /**
     * 添加楼层
     * @param layer 要添加的楼层
     * @param moveDirection 要去往的方向
     */
    void addLayer(Layer layer, MoveDirection moveDirection) {
        if (!this.taskList.contains(layer)) {
            Lift lift = this.lift;
            if (lift.getCurrentLayer().equals(layer)) {
                this.alreadyLocated(layer);
                return;
            }
            lift.setTargetLayerIfNull(layer);
            int result = lift.checkLayerInRange(layer);
            // 如果电梯处于停止状态
            if (lift.isMoveStop()) {
                if (result > 0) {
                    this.addUpLayerWithSort(layer);
                    lift.setCurrentMoveDirection(MoveDirection.UP);
                } else if (result < 0) {
                    this.addDownLayerWithSort(layer);
                    lift.setCurrentMoveDirection(MoveDirection.DOWN);
                }
                lift.setTargetLayer(layer);
                return;
            }
            // 根据按钮点击的是上升还是下降来调用
            if (MoveDirection.isMoveUp(moveDirection)) {
                this.addUpLayer(result, layer);
            } else {
                this.addDownLayer(result, layer);
            }
        }
    }

    /**
     * 添加要上楼的楼层
     *
     * @param result result
     * @param layer 要添加的楼层
     */
    private void addUpLayer(int result, Layer layer) {
        Lift lift = this.lift;
        if (lift.isMoveUp()) {
            if (result == 0) {
                lift.setTargetLayer(layer);
                this.addUpLayerWithSort(layer);
            } else if (result == 1) {
                this.addUpLayerWithSort(layer);
            } else if (result == -1) {
                this.addLayerIfNotExist(this.nextUpList, layer);
            }
        } else if (lift.isMoveDown()) {
            this.addLayerIfNotExist(this.nextUpList, layer);
        }
    }

    /**
     * 添加要下楼的楼层
     *
     * @param layer 要添加的楼层
     */
    void addDownLayer(int result, Layer layer) {
        Lift lift = this.lift;
        if (lift.isMoveDown()) {
            if (result == 0) {
                lift.setTargetLayer(layer);
                this.addDownLayerWithSort(layer);
            } else if (result == 1) {
                this.addDownLayerWithSort(layer);
            } else if (result == -1) {
                this.addLayerIfNotExist(this.nextDownList, layer);
            }
        } else if (lift.isMoveUp()) {
            this.addLayerIfNotExist(this.nextDownList, layer);
        }
    }

    void addLayerIfNotExist(List<Layer> list, Layer layer) {
        if (!list.contains(layer)) {
            list.add(layer);
        }
    }

    /**
     * 已经位于目标楼层时调用的函数
     */
    private void alreadyLocated(Layer layer) {
        System.out.println("已位于第 " + layer.getLayerNumber() + " 楼");
    }

    /**
     * 添加上楼的用户楼层并升序排序
     *
     * @param layer 要添加的楼层
     */
    private void addUpLayerWithSort(Layer layer) {
        this.taskList.add(layer);
        this.sort();
    }

    /**
     * 添加下楼的用户楼层并降序排序
     *
     * @param layer 要添加的楼层
     */
    private void addDownLayerWithSort(Layer layer) {
        this.taskList.add(layer);
        this.reserveSort();
    }

    /**
     * 升序排序
     */
    private void sort() {
        List<Layer> taskList = this.taskList;
        taskList.sort((preLayer, nextLayer) -> {
            int preLayerNumber = preLayer.getLayerNumber();
            int nextLayerNumber = nextLayer.getLayerNumber();
            return Integer.compare(preLayerNumber, nextLayerNumber);
        });
    }

    /**
     * 降序排序
     */
    private void reserveSort() {
        List<Layer> taskList = this.taskList;
        taskList.sort((preLayer, nextLayer) -> {
            int preLayerNumber = preLayer.getLayerNumber();
            int nextLayerNumber = nextLayer.getLayerNumber();
            return Integer.compare(nextLayerNumber, preLayerNumber);
        });
    }

    /**
     * 是否还有上下楼的任务
     *
     * @return 如果有任务返回 true, 反之返回 false
     */
    boolean hasTask() {
        return !taskList.isEmpty() || !this.nextUpList.isEmpty() || !this.nextDownList.isEmpty();
    }
}
